'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import type { Person, RelationshipType } from '@/types'

const RELATIONSHIP_TYPES: RelationshipType[] = ['partner', 'friend', 'family', 'colleague', 'other']

function todayMax(): string {
  return new Date().toISOString().split('T')[0]
}

interface PersonFormProps {
  person?: Person
  onSave?: (id: string) => void
}

export default function PersonForm({ person }: PersonFormProps) {
  const router = useRouter()
  const supabase = createClient()

  const [name, setName] = useState(person?.name || '')
  const [relationshipType, setRelationshipType] = useState<RelationshipType>(person?.relationship_type || 'friend')
  const [birthday, setBirthday] = useState(person?.birthday || '')
  const [notes, setNotes] = useState(person?.notes || '')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const payload = {
      user_id: user.id,
      name: name.trim(),
      relationship_type: relationshipType,
      birthday: birthday || null,
      notes: notes || null,
    }

    if (person) {
      const { error } = await supabase.from('people').update(payload).eq('id', person.id)
      if (error) { setError(error.message); setLoading(false); return }
      router.push(`/people/${person.id}`)
    } else {
      const { data, error } = await supabase.from('people').insert(payload).select().single()
      if (error) { setError(error.message); setLoading(false); return }
      router.push(`/people/${data.id}`)
    }
  }

  async function handleDelete() {
    if (!person) return
    if (!confirm(`Remove ${person.name}? This will also delete all their entries.`)) return
    await supabase.from('people').delete().eq('id', person.id)
    router.push('/people')
  }

  return (
    <form onSubmit={handleSubmit}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '500px' }}>
        <div>
          <label className="label" htmlFor="name">Name *</label>
          <input className="input" id="name" value={name} onChange={e => setName(e.target.value)} placeholder="Their name" required />
        </div>

        <div>
          <label className="label">Relationship</label>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {RELATIONSHIP_TYPES.map(type => (
              <button
                key={type}
                type="button"
                onClick={() => setRelationshipType(type)}
                style={{
                  padding: '0.4rem 0.9rem',
                  borderRadius: '8px',
                  border: '1px solid',
                  borderColor: relationshipType === type ? 'var(--accent)' : 'var(--card-border)',
                  background: relationshipType === type ? 'var(--accent)' : 'transparent',
                  color: relationshipType === type ? 'white' : 'var(--text-secondary)',
                  fontSize: '0.8rem',
                  textTransform: 'capitalize',
                  cursor: 'pointer',
                  transition: 'all 0.15s',
                }}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="label" htmlFor="birthday">Birthday (optional)</label>
          <input
            type="date"
            id="birthday"
            className="input"
            value={birthday}
            onChange={e => setBirthday(e.target.value)}
            max={todayMax()}
          />
        </div>

        <div>
          <label className="label" htmlFor="notes">Notes about them (optional)</label>
          <textarea
            className="input"
            id="notes"
            value={notes}
            onChange={e => setNotes(e.target.value)}
            placeholder="Things to know — interests, quirks, what makes them them…"
            rows={4}
            style={{ resize: 'vertical' }}
          />
        </div>

        {error && <p style={{ fontSize: '0.8rem', color: '#C0392B' }}>{error}</p>}

        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          <button type="submit" className="btn-primary" disabled={loading || !name.trim()}>
            {loading ? 'Saving…' : person ? 'Save changes' : 'Add person'}
          </button>
          <button type="button" className="btn-secondary" onClick={() => router.back()}>Cancel</button>
          {person && (
            <button
              type="button"
              onClick={handleDelete}
              style={{ marginLeft: 'auto', background: 'none', border: 'none', color: 'var(--muted)', fontSize: '0.75rem', cursor: 'pointer' }}
            >
              Remove
            </button>
          )}
        </div>
      </div>
    </form>
  )
}
