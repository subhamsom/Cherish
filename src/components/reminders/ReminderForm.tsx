'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import type { Person } from '@/types'
import type { Entry } from '@/types'

const REPEAT_OPTIONS = [
  { value: 'none', label: 'None' },
  { value: 'weekly', label: 'Weekly' },
  { value: 'monthly', label: 'Monthly' },
  { value: 'yearly', label: 'Yearly' },
] as const

const CHANNEL_OPTIONS = [
  { value: 'email', label: 'Email' },
  { value: 'in_app', label: 'In-App' },
  { value: 'both', label: 'Both' },
] as const

function getDefaultDateTime(): string {
  const d = new Date()
  d.setDate(d.getDate() + 1)
  d.setHours(9, 0, 0, 0)
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  const hours = String(d.getHours()).padStart(2, '0')
  const minutes = String(d.getMinutes()).padStart(2, '0')
  return `${year}-${month}-${day}T${hours}:${minutes}`
}

export default function ReminderForm() {
  const router = useRouter()
  const supabase = createClient()

  const [people, setPeople] = useState<Person[]>([])
  const [entries, setEntries] = useState<Pick<Entry, 'id' | 'title' | 'date'>[]>([])
  const [title, setTitle] = useState('')
  const [personId, setPersonId] = useState('')
  const [remindAt, setRemindAt] = useState(getDefaultDateTime())
  const [repeat, setRepeat] = useState<'none' | 'weekly' | 'monthly' | 'yearly'>('none')
  const [channel, setChannel] = useState<'email' | 'in_app' | 'both'>('email')
  const [entryId, setEntryId] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    supabase
      .from('people')
      .select('id, name, relationship_type')
      .order('name')
      .then(({ data }) => {
        if (data) setPeople(data as Person[])
      })
  }, [])

  useEffect(() => {
    if (!personId) {
      setEntries([])
      setEntryId('')
      return
    }
    supabase
      .from('entries')
      .select('id, title, date')
      .eq('person_id', personId)
      .order('date', { ascending: false })
      .then(({ data }) => {
        if (data) setEntries(data as Pick<Entry, 'id' | 'title' | 'date'>[])
        setEntryId('')
      })
  }, [personId])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      setError('You must be signed in to create a reminder.')
      setLoading(false)
      return
    }

    const payload = {
      user_id: user.id,
      person_id: personId,
      entry_id: entryId || null,
      title: title.trim(),
      remind_at: new Date(remindAt).toISOString(),
      repeat,
      channel,
      is_sent: false,
    }

    const { error: insertError } = await supabase.from('reminders').insert(payload)
    if (insertError) {
      setError(insertError.message)
      setLoading(false)
      return
    }

    router.push('/reminders')
  }

  const inputStyle = {
    width: '100%',
    background: '#FFFFFF',
    borderRadius: '8px',
    border: '1px solid var(--card-border)',
    padding: '0.75rem 1rem',
    fontFamily: 'Inter, sans-serif',
    fontSize: '0.9rem',
    color: 'var(--text-primary)',
  } as const

  const selectStyle = {
    ...inputStyle,
    appearance: 'none' as const,
    WebkitAppearance: 'none' as const,
  }

  return (
    <form onSubmit={handleSubmit}>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '1.5rem',
          maxWidth: '560px',
          background: 'var(--card-bg)',
          border: '1px solid var(--card-border)',
          borderRadius: '12px',
          padding: '1.75rem',
        }}
      >
        <div>
          <label className="label" htmlFor="title">
            Title *
          </label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Call for birthday"
            required
            className="input"
            style={inputStyle}
          />
        </div>

        <div>
          <label className="label" htmlFor="person">
            Person *
          </label>
          <select
            id="person"
            value={personId}
            onChange={(e) => setPersonId(e.target.value)}
            required
            className="input input-select"
            style={selectStyle}
          >
            <option value="">Select a person…</option>
            {people.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="label" htmlFor="remind_at">
            Date & time *
          </label>
          <input
            id="remind_at"
            type="datetime-local"
            value={remindAt}
            onChange={(e) => setRemindAt(e.target.value)}
            required
            className="input"
            style={inputStyle}
          />
        </div>

        <div>
          <label className="label" htmlFor="repeat">
            Repeat
          </label>
          <select
            id="repeat"
            value={repeat}
            onChange={(e) => setRepeat(e.target.value as typeof repeat)}
            className="input input-select"
            style={selectStyle}
          >
            {REPEAT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="label" htmlFor="channel">
            Channel
          </label>
          <select
            id="channel"
            value={channel}
            onChange={(e) => setChannel(e.target.value as typeof channel)}
            className="input input-select"
            style={selectStyle}
          >
            {CHANNEL_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="label" htmlFor="entry">
            Link to entry (optional)
          </label>
          <select
            id="entry"
            value={entryId}
            onChange={(e) => setEntryId(e.target.value)}
            className="input input-select"
            style={selectStyle}
            disabled={!personId}
          >
            <option value="">None</option>
            {entries.map((entry) => (
              <option key={entry.id} value={entry.id}>
                {entry.title} {entry.date ? `— ${entry.date}` : ''}
              </option>
            ))}
          </select>
        </div>

        {error && (
          <p style={{ fontSize: '0.8rem', color: '#C0392B', margin: 0 }}>
            {error}
          </p>
        )}

        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          <button
            type="submit"
            disabled={loading || !title.trim() || !personId || !remindAt}
            style={{
              background: 'var(--accent)',
              color: '#FFFFFF',
              padding: '0.75rem 1.75rem',
              border: 'none',
              borderRadius: '50px',
              fontFamily: 'Inter, sans-serif',
              fontSize: '0.875rem',
              fontWeight: 500,
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.7 : 1,
              boxShadow: '0 2px 8px rgba(124, 58, 237, 0.25)',
            }}
          >
            {loading ? 'Saving…' : 'Create reminder'}
          </button>
          <button
            type="button"
            className="btn-secondary"
            onClick={() => router.back()}
          >
            Cancel
          </button>
        </div>
      </div>
    </form>
  )
}
