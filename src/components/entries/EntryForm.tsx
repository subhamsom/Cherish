'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import type { Person, EntryType } from '@/types'

const ENTRY_TYPES: { value: EntryType; label: string; desc: string }[] = [
  { value: 'moment', label: 'Moment', desc: 'A story, memory, or something meaningful' },
  { value: 'gift_given', label: 'Gift given', desc: 'A gift you gave them' },
  { value: 'gift_received', label: 'Gift received', desc: 'A gift they gave you' },
  { value: 'reminder_note', label: 'Note', desc: 'Something to remember or follow up on' },
]

const MOODS = ['😊', '🥰', '😂', '🥺', '😮', '💛', '✨', '🌸', '🙏', '💭']

interface EntryFormProps {
  defaultPersonId?: string
  entry?: any
}

export default function EntryForm({ defaultPersonId, entry }: EntryFormProps) {
  const router = useRouter()
  const supabase = createClient()

  const [people, setPeople] = useState<Person[]>([])
  const [personId, setPersonId] = useState(entry?.person_id || defaultPersonId || '')
  const [type, setType] = useState<EntryType>(entry?.type || 'moment')
  const [title, setTitle] = useState(entry?.title ?? '')
  const [body, setBody] = useState(entry?.body ?? '')
  const [date, setDate] = useState(entry?.date || new Date().toISOString().split('T')[0])
  const [tags, setTags] = useState<string>(entry?.tags?.join(', ') || '')
  const [mood, setMood] = useState(entry?.mood || '')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    supabase.from('people').select('id, name, relationship_type').order('name').then(({ data }) => {
      if (data) setPeople(data as Person[])
    })
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const tagsArray = tags.split(',').map(t => t.trim()).filter(Boolean)
    const payload = {
      user_id: user.id,
      person_id: personId,
      type,
      title: title.trim(),
      body: body.trim() || null,
      date,
      tags: tagsArray,
      mood: mood || null,
    }

    if (entry) {
      const { error } = await supabase.from('entries').update(payload).eq('id', entry.id)
      if (error) { setError(error.message); setLoading(false); return }
    } else {
      const { error } = await supabase.from('entries').insert(payload)
      if (error) { setError(error.message); setLoading(false); return }
    }

    const selectedPerson = people.find(p => p.id === personId)
    if (selectedPerson) router.push(`/people/${selectedPerson.id}`)
    else router.push('/dashboard')
  }

  return (
    <form onSubmit={handleSubmit}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '560px' }}>

        {/* Person select */}
        <div>
          <label className="label" htmlFor="person">Person *</label>
          <select
            className="input"
            id="person"
            value={personId}
            onChange={e => setPersonId(e.target.value)}
            required
            style={{ appearance: 'auto' }}
          >
            <option value="">Select a person…</option>
            {people.map(p => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
        </div>

        {/* Type */}
        <div>
          <label className="label">Type</label>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            {ENTRY_TYPES.map(t => (
              <button
                key={t.value}
                type="button"
                onClick={() => setType(t.value)}
                style={{
                  padding: '0.6rem 1rem',
                  borderRadius: '2px',
                  border: '1px solid',
                  borderColor: type === t.value ? 'var(--terracotta)' : 'var(--border)',
                  background: type === t.value ? 'var(--warm-white)' : 'transparent',
                  textAlign: 'left',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'baseline',
                  gap: '0.5rem',
                }}
              >
                <span style={{ fontSize: '0.85rem', fontWeight: type === t.value ? 500 : 300, color: type === t.value ? 'var(--terracotta)' : 'var(--charcoal)' }}>
                  {t.label}
                </span>
                <span style={{ fontSize: '0.75rem', color: 'var(--muted)' }}>{t.desc}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Title */}
        <div>
          <label className="label" htmlFor="title">Title *</label>
          <input className="input" id="title" value={title} onChange={e => setTitle(e.target.value)} placeholder="A short description…" required />
        </div>

        {/* Body */}
        <div>
          <label className="label" htmlFor="body">Details (optional)</label>
          <textarea
            className="input" id="body"
            value={body} onChange={e => setBody(e.target.value)}
            placeholder="The full story, what was said, how it felt…"
            rows={4} style={{ resize: 'vertical' }}
          />
        </div>

        {/* Date */}
        <div>
          <label className="label" htmlFor="date">Date</label>
          <input
            type="date"
            id="date"
            className="input"
            value={date}
            onChange={e => setDate(e.target.value)}
            max={new Date().toISOString().split('T')[0]}
          />
        </div>

        {/* Tags */}
        <div>
          <label className="label" htmlFor="tags">Tags (comma-separated, optional)</label>
          <input className="input" id="tags" value={tags} onChange={e => setTags(e.target.value)} placeholder="travel, birthday, food…" />
        </div>

        {/* Mood */}
        <div>
          <label className="label">Mood / reaction (optional)</label>
          <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
            {MOODS.map(m => (
              <button
                key={m} type="button" onClick={() => setMood(mood === m ? '' : m)}
                style={{
                  width: '36px', height: '36px', fontSize: '1.2rem',
                  borderRadius: '2px', border: '1px solid',
                  borderColor: mood === m ? 'var(--terracotta)' : 'var(--border)',
                  background: mood === m ? 'var(--warm-white)' : 'transparent',
                  cursor: 'pointer',
                }}
              >
                {m}
              </button>
            ))}
          </div>
        </div>

        {error && <p style={{ fontSize: '0.8rem', color: '#C0392B' }}>{error}</p>}

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button type="submit" className="btn-primary" disabled={loading || !title.trim() || !personId}>
            {loading ? 'Saving…' : entry ? 'Save changes' : 'Save entry'}
          </button>
          <button type="button" className="btn-secondary" onClick={() => router.back()}>Cancel</button>
        </div>
      </div>
    </form>
  )
}
