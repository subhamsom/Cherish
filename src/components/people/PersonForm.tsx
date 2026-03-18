'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import DatePicker from '@/components/ui/DatePicker'
import type { Person, RelationshipType } from '@/types'
import { RELATIONSHIP_COLORS, RELATIONSHIP_BG } from '@/lib/people'

const RELATIONSHIP_TYPES: RelationshipType[] = ['partner', 'friend', 'family', 'colleague', 'other']

interface PersonFormProps {
  person?: Person
  onSave?: (id: string) => void
  onSuccess?: () => void
}

export default function PersonForm({ person, onSuccess }: PersonFormProps) {
  const router = useRouter()
  const supabase = createClient()

  const [name, setName] = useState(person?.name || '')
  const [relationshipType, setRelationshipType] = useState<RelationshipType>(
    person?.relationship_type || 'friend'
  )
  const [birthday, setBirthday] = useState(person?.birthday || '')
  const birthdayDate = birthday ? new Date(birthday + 'T12:00:00') : null
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
      if (error) {
        setError(error.message)
        setLoading(false)
        return
      }
      if (onSuccess) {
        onSuccess()
        return
      }
      router.push(`/people/${person.id}`)
    } else {
      const { data, error } = await supabase.from('people').insert(payload).select().single()
      if (error) {
        setError(error.message)
        setLoading(false)
        return
      }
      if (onSuccess) {
        onSuccess()
        return
      }
      router.push(`/people/${data.id}`)
    }
  }

  async function handleDelete() {
    if (!person) return
    if (!confirm(`Remove ${person.name}? This will also delete all their entries.`)) return
    await supabase.from('people').delete().eq('id', person.id)
    router.push('/people')
  }

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '0.75rem 1rem',
    borderRadius: '12px',
    border: '1px solid var(--card-border)',
    background: '#fff',
    fontSize: '0.95rem',
    color: 'var(--text-primary)',
    fontFamily: 'Inter, sans-serif',
  }

  return (
    <form onSubmit={handleSubmit}>
      <div
        style={{
          maxWidth: '520px',
          padding: '1.75rem 1.5rem',
          background: 'var(--card-bg)',
          border: '1px solid var(--card-border)',
          borderRadius: '16px',
          boxShadow: '0 2px 12px rgba(124, 58, 237, 0.04)',
          display: 'flex',
          flexDirection: 'column',
          gap: '1.5rem',
        }}
      >
        <div>
          <label className="label" htmlFor="name" style={{ display: 'block', marginBottom: '0.4rem', fontSize: '0.8rem', fontWeight: 500, color: '#6B7280' }}>
            Name *
          </label>
          <input
            className="input"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Their name"
            required
            style={inputStyle}
          />
        </div>

        <div>
          <label className="label" style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.8rem', fontWeight: 500, color: '#6B7280' }}>
            Relationship
          </label>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {RELATIONSHIP_TYPES.map((type) => {
              const isSelected = relationshipType === type
              const color = RELATIONSHIP_COLORS[type]
              const bg = RELATIONSHIP_BG[type]
              return (
                <button
                  key={type}
                  type="button"
                  onClick={() => setRelationshipType(type)}
                  style={{
                    padding: '0.45rem 0.9rem',
                    borderRadius: '999px',
                    border: isSelected ? `2px solid ${color}` : '1px solid var(--card-border)',
                    background: isSelected ? bg : 'transparent',
                    color: isSelected ? color : '#6B7280',
                    fontSize: '0.85rem',
                    textTransform: 'capitalize',
                    cursor: 'pointer',
                    fontWeight: isSelected ? 600 : 500,
                    fontFamily: 'Inter, sans-serif',
                    transition: 'all 0.15s ease',
                  }}
                >
                  {type}
                </button>
              )
            })}
          </div>
        </div>

        <div>
          <label className="label" htmlFor="birthday" style={{ display: 'block', marginBottom: '0.4rem', fontSize: '0.8rem', fontWeight: 500, color: '#6B7280' }}>
            Birthday (optional)
          </label>
          <DatePicker
            value={birthdayDate}
            onChange={(d) => {
              const y = d.getFullYear()
              const m = String(d.getMonth() + 1).padStart(2, '0')
              const day = String(d.getDate()).padStart(2, '0')
              setBirthday(`${y}-${m}-${day}`)
            }}
            placeholder="Select date…"
            maxDate={new Date()}
          />
        </div>

        <div>
          <label className="label" htmlFor="notes" style={{ display: 'block', marginBottom: '0.4rem', fontSize: '0.8rem', fontWeight: 500, color: '#6B7280' }}>
            Notes about them (optional)
          </label>
          <textarea
            className="input"
            id="notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Interests, quirks, what makes them them…"
            rows={4}
            style={{ ...inputStyle, resize: 'vertical', minHeight: '100px' }}
          />
        </div>

        {error && (
          <p style={{ fontSize: '0.875rem', color: '#DC2626', margin: 0 }}>
            {error}
          </p>
        )}

        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
          <button
            type="submit"
            className="btn-primary"
            disabled={loading || !name.trim()}
            style={{
              borderRadius: '50px',
              padding: '0.65rem 1.4rem',
              fontSize: '0.9rem',
              fontWeight: 500,
            }}
          >
            {loading ? 'Saving…' : person ? 'Save changes' : 'Add person'}
          </button>
          <button
            type="button"
            className="btn-secondary"
            onClick={() => (onSuccess ? onSuccess() : router.back())}
            style={{ borderRadius: '12px', padding: '0.65rem 1.2rem', fontSize: '0.9rem' }}
          >
            Cancel
          </button>
          {person && (
            <button
              type="button"
              onClick={handleDelete}
              style={{
                marginLeft: 'auto',
                background: 'none',
                border: 'none',
                color: '#9CA3AF',
                fontSize: '0.8rem',
                cursor: 'pointer',
                textDecoration: 'underline',
                fontFamily: 'Inter, sans-serif',
              }}
            >
              Remove person
            </button>
          )}
        </div>
      </div>
    </form>
  )
}
