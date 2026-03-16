'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Sparkles, Gift, FileText } from 'lucide-react'
import type { Person, EntryType } from '@/types'

const ENTRY_TYPES: {
  value: EntryType
  label: string
  desc: string
  placeholder: string
  iconColor: string
  Icon: typeof Sparkles
}[] = [
  { value: 'moment', label: 'Moment', desc: 'A story, memory, or something meaningful', placeholder: 'What happened?', iconColor: '#7C3AED', Icon: Sparkles },
  { value: 'gift_given', label: 'Gift\u00a0given', desc: 'A gift you gave them', placeholder: 'What did you give?', iconColor: '#DB2777', Icon: Gift },
  { value: 'gift_received', label: 'Gift\u00a0received', desc: 'A gift they gave you', placeholder: 'What did you receive?', iconColor: '#059669', Icon: Gift },
  { value: 'reminder_note', label: 'Note', desc: 'Something to remember or follow up on', placeholder: "What's on your mind?", iconColor: '#D97706', Icon: FileText },
]

interface EntryFormProps {
  defaultPersonId?: string
  entry?: any
  onSuccess?: () => void
}

export default function EntryForm({ defaultPersonId, entry, onSuccess }: EntryFormProps) {
  const router = useRouter()
  const supabase = createClient()

  const [people, setPeople] = useState<Person[]>([])
  const [personId, setPersonId] = useState(entry?.person_id || defaultPersonId || '')
  const [type, setType] = useState<EntryType>(entry?.type || 'moment')
  const [title, setTitle] = useState(entry?.title ?? '')
  const [body, setBody] = useState(entry?.body ?? '')
  const [date, setDate] = useState(entry?.date || new Date().toISOString().split('T')[0])
  const [tags, setTags] = useState<string>(entry?.tags?.join(', ') || '')
  const [datePickerOpen, setDatePickerOpen] = useState(false)
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
      mood: entry?.mood ?? null,
    }

    if (entry) {
      const { error } = await supabase.from('entries').update(payload).eq('id', entry.id)
      if (error) { setError(error.message); setLoading(false); return }
    } else {
      const { error } = await supabase.from('entries').insert(payload)
      if (error) { setError(error.message); setLoading(false); return }
    }

    if (onSuccess) {
      onSuccess()
      return
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
            id="person"
            value={personId}
            onChange={e => setPersonId(e.target.value)}
            required
            className="input input-select"
            style={{
              appearance: 'none',
              WebkitAppearance: 'none',
              background: '#FFFFFF',
              borderRadius: '8px',
              border: '1px solid var(--card-border)',
              padding: '0.75rem 1rem',
              fontFamily: 'Inter, sans-serif',
              fontSize: '0.9rem',
              color: 'var(--text-primary)',
            }}
          >
            <option value="">Select a person…</option>
            {people.map(p => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
        </div>

        {/* Type — 2x2 grid of cards */}
        <div>
          <label className="label">Type</label>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '0.75rem',
            }}
          >
            {ENTRY_TYPES.map((t) => {
              const isSelected = type === t.value
              const Icon = t.Icon
              return (
                <button
                  key={t.value}
                  type="button"
                  onClick={() => setType(t.value)}
                  style={{
                    padding: '12px 16px',
                    borderRadius: '12px',
                    border: isSelected ? '2px solid #7C3AED' : '1px solid #E5E1FF',
                    background: isSelected ? 'rgba(124, 58, 237, 0.06)' : '#FFFFFF',
                    textAlign: 'left',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    gap: '0.35rem',
                    fontFamily: 'inherit',
                    boxShadow: isSelected ? '0 2px 8px rgba(124, 58, 237, 0.12)' : 'none',
                    transition: 'border-color 0.15s ease, background 0.15s ease, box-shadow 0.15s ease',
                  }}
                  onMouseEnter={(e) => {
                    if (!isSelected) {
                      e.currentTarget.style.borderColor = '#A78BFA'
                      e.currentTarget.style.boxShadow = '0 2px 8px rgba(167, 139, 250, 0.2)'
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isSelected) {
                      e.currentTarget.style.borderColor = '#E5E1FF'
                      e.currentTarget.style.boxShadow = 'none'
                    }
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ display: 'flex', color: t.iconColor, flexShrink: 0 }}>
                      <Icon size={16} strokeWidth={2} />
                    </span>
                    <span
                      style={{
                        fontFamily: 'var(--font-heading), serif',
                        fontSize: '0.9rem',
                        fontWeight: 700,
                        color: 'var(--text-primary)',
                      }}
                    >
                      {t.label}
                    </span>
                  </div>
                  <span
                    style={{
                      fontFamily: 'var(--font-body), sans-serif',
                      fontSize: '0.78rem',
                      color: '#747a84',
                      lineHeight: 1.35,
                      textAlign: 'left',
                    }}
                  >
                    {t.desc}
                  </span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Title */}
        <div>
          <label className="label" htmlFor="title">Title *</label>
          <input
            className="input"
            id="title"
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder={ENTRY_TYPES.find(t => t.value === type)?.placeholder ?? 'A short description…'}
            required
          />
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
          <label className="label">Date</label>
          {(() => {
            const today = new Date().toISOString().split('T')[0]
            const yesterday = (() => { const d = new Date(); d.setDate(d.getDate() - 1); return d.toISOString().split('T')[0] })()
            const isToday = date === today
            const isYesterday = date === yesterday
            const isCustom = !isToday && !isYesterday
            return (
              <>
                <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '0.5rem' }}>
                  <button
                    type="button"
                    onClick={() => { setDate(today); setDatePickerOpen(false) }}
                    style={{
                      padding: '0.35rem 0.75rem',
                      borderRadius: 999,
                      border: '1px solid',
                      borderColor: isToday ? 'var(--accent)' : 'var(--card-border)',
                      background: isToday ? '#EDE9FE' : 'transparent',
                      fontSize: '0.8rem',
                      color: isToday ? 'var(--accent)' : 'var(--text-primary)',
                      cursor: 'pointer',
                      fontFamily: 'Inter, sans-serif',
                    }}
                  >
                    Today
                  </button>
                  <button
                    type="button"
                    onClick={() => { setDate(yesterday); setDatePickerOpen(false) }}
                    style={{
                      padding: '0.35rem 0.75rem',
                      borderRadius: 999,
                      border: '1px solid',
                      borderColor: isYesterday ? 'var(--accent)' : 'var(--card-border)',
                      background: isYesterday ? '#EDE9FE' : 'transparent',
                      fontSize: '0.8rem',
                      color: isYesterday ? 'var(--accent)' : 'var(--text-primary)',
                      cursor: 'pointer',
                      fontFamily: 'Inter, sans-serif',
                    }}
                  >
                    Yesterday
                  </button>
                  <button
                    type="button"
                    onClick={() => setDatePickerOpen(true)}
                    style={{
                      padding: '0.35rem 0.75rem',
                      borderRadius: 999,
                      border: '1px solid',
                      borderColor: isCustom || datePickerOpen ? 'var(--accent)' : 'var(--card-border)',
                      background: isCustom || datePickerOpen ? '#EDE9FE' : 'transparent',
                      fontSize: '0.8rem',
                      color: isCustom || datePickerOpen ? 'var(--accent)' : 'var(--text-primary)',
                      cursor: 'pointer',
                      fontFamily: 'Inter, sans-serif',
                    }}
                  >
                    Pick a date
                  </button>
                </div>
                {(datePickerOpen || isCustom) && (
                  <input
                    type="date"
                    id="date"
                    className="input"
                    value={date}
                    onChange={e => setDate(e.target.value)}
                    max={new Date().toISOString().split('T')[0]}
                    style={{ marginTop: '0.5rem' }}
                  />
                )}
              </>
            )
          })()}
        </div>

        {/* Tags */}
        <div>
          <label className="label" htmlFor="tags">Tags (comma-separated, optional)</label>
          <input className="input" id="tags" value={tags} onChange={e => setTags(e.target.value)} placeholder="travel, birthday, food…" />
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
