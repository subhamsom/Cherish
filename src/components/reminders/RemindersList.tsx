'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import type { Person } from '@/types'
import type { Reminder } from '@/types'

const RELATIONSHIP_COLORS: Record<string, string> = {
  partner: '#F9A8D4',
  friend: '#93C5FD',
  family: '#86EFAC',
  colleague: '#FCD34D',
  other: '#C4B5FD',
}

const REPEAT_LABELS: Record<string, string> = {
  none: '',
  weekly: 'Weekly',
  monthly: 'Monthly',
  yearly: 'Yearly',
}

const CHANNEL_LABELS: Record<string, string> = {
  email: 'Email',
  in_app: 'In-App',
  both: 'Both',
}

type ReminderWithPerson = Reminder & { people: Pick<Person, 'name' | 'relationship_type'> | null }

function formatRemindAt(iso: string): string {
  const d = new Date(iso)
  const dateStr = d.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'short' })
  const timeStr = d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })
  return `${dateStr} · ${timeStr}`
}

function isOverdueOrToday(remindAt: string): boolean {
  const d = new Date(remindAt)
  const now = new Date()
  const todayEnd = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999)
  return d <= todayEnd
}

export default function RemindersList() {
  const supabase = createClient()
  const [reminders, setReminders] = useState<ReminderWithPerson[]>([])
  const [people, setPeople] = useState<Person[]>([])
  const [filterPersonId, setFilterPersonId] = useState<string>('')
  const [loading, setLoading] = useState(true)
  const [actioningId, setActioningId] = useState<string | null>(null)

  async function fetchReminders() {
    const { data, error } = await supabase
      .from('reminders')
      .select('*, people(name, relationship_type)')
      .order('remind_at', { ascending: true })

    if (error) {
      console.error('[Reminders] fetch error:', error)
      setReminders([])
    } else {
      setReminders((data as ReminderWithPerson[]) ?? [])
    }
    setLoading(false)
  }

  async function fetchPeople() {
    const { data } = await supabase.from('people').select('id, name').order('name')
    setPeople((data as Person[]) ?? [])
  }

  useEffect(() => {
    fetchReminders()
    fetchPeople()
  }, [])

  async function handleMarkDone(id: string) {
    setActioningId(id)
    await supabase.from('reminders').delete().eq('id', id)
    await fetchReminders()
    setActioningId(null)
  }

  async function handleSnooze(id: string, currentRemindAt: string) {
    setActioningId(id)
    const next = new Date(currentRemindAt)
    next.setDate(next.getDate() + 7)
    await supabase.from('reminders').update({ remind_at: next.toISOString() }).eq('id', id)
    await fetchReminders()
    setActioningId(null)
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this reminder?')) return
    setActioningId(id)
    await supabase.from('reminders').delete().eq('id', id)
    await fetchReminders()
    setActioningId(null)
  }

  const filtered = filterPersonId
    ? reminders.filter((r) => r.person_id === filterPersonId)
    : reminders

  const overdueAndToday = filtered.filter((r) => isOverdueOrToday(r.remind_at))
  const upcoming = filtered.filter((r) => !isOverdueOrToday(r.remind_at))

  const selectStyle = {
    width: '100%',
    maxWidth: '220px',
    background: '#FFFFFF',
    borderRadius: '8px',
    border: '1px solid var(--card-border)',
    padding: '0.5rem 0.75rem',
    fontFamily: 'Inter, sans-serif',
    fontSize: '0.875rem',
    color: 'var(--text-primary)',
    appearance: 'none' as const,
    WebkitAppearance: 'none' as const,
  }

  function renderCard(r: ReminderWithPerson, isOverdue: boolean) {
    const personName = r.people?.name ?? 'Unknown'
    const relType = r.people?.relationship_type ?? 'other'
    const dotColor = RELATIONSHIP_COLORS[relType] ?? RELATIONSHIP_COLORS.other
    const busy = actioningId === r.id

    return (
      <div
        key={r.id}
        style={{
          background: 'var(--card-bg)',
          border: '1px solid var(--card-border)',
          borderRadius: '10px',
          padding: '1rem 1.25rem',
          borderLeft: isOverdue ? `4px solid #F9A8D4` : undefined,
          boxShadow: isOverdue ? '0 1px 3px rgba(249, 168, 212, 0.15)' : '0 1px 3px rgba(124, 58, 237, 0.06)',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <p style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-primary)', margin: 0 }}>
            {r.title}
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
            <span
              style={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                backgroundColor: dotColor,
                flexShrink: 0,
              }}
            />
            <span style={{ fontSize: '0.85rem', color: '#747a84' }}>{personName}</span>
          </div>
          <p style={{ fontSize: '0.8rem', color: '#747a84', margin: 0 }}>
            {formatRemindAt(r.remind_at)}
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginTop: '0.25rem' }}>
            {r.repeat !== 'none' && (
              <span
                style={{
                  fontSize: '0.7rem',
                  padding: '0.2rem 0.5rem',
                  borderRadius: '6px',
                  background: 'rgba(124, 58, 237, 0.12)',
                  color: 'var(--accent)',
                  fontWeight: 500,
                }}
              >
                {REPEAT_LABELS[r.repeat]}
              </span>
            )}
            <span
              style={{
                fontSize: '0.7rem',
                padding: '0.2rem 0.5rem',
                borderRadius: '6px',
                background: 'rgba(107, 114, 128, 0.12)',
                color: '#747a84',
                fontWeight: 500,
              }}
            >
              {CHANNEL_LABELS[r.channel]}
            </span>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.75rem', flexWrap: 'wrap' }}>
            <button
              type="button"
              onClick={() => handleMarkDone(r.id)}
              disabled={busy}
              style={{
                fontSize: '0.75rem',
                padding: '0.35rem 0.65rem',
                border: '1px solid var(--card-border)',
                borderRadius: '8px',
                background: 'transparent',
                color: '#747a84',
                cursor: busy ? 'not-allowed' : 'pointer',
                fontFamily: 'Inter, sans-serif',
              }}
            >
              Mark done
            </button>
            <button
              type="button"
              onClick={() => handleSnooze(r.id, r.remind_at)}
              disabled={busy}
              style={{
                fontSize: '0.75rem',
                padding: '0.35rem 0.65rem',
                border: '1px solid var(--card-border)',
                borderRadius: '8px',
                background: 'transparent',
                color: '#747a84',
                cursor: busy ? 'not-allowed' : 'pointer',
                fontFamily: 'Inter, sans-serif',
              }}
            >
              Snooze 1 week
            </button>
            <button
              type="button"
              onClick={() => handleDelete(r.id)}
              disabled={busy}
              style={{
                fontSize: '0.75rem',
                padding: '0.35rem 0.65rem',
                border: 'none',
                background: 'none',
                color: '#C0392B',
                cursor: busy ? 'not-allowed' : 'pointer',
                fontFamily: 'Inter, sans-serif',
              }}
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <p style={{ fontSize: '0.9rem', color: '#747a84' }}>Loading reminders…</p>
    )
  }

  const hasReminders = filtered.length > 0

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
        <label htmlFor="filter-person" className="label" style={{ marginBottom: 0 }}>
          Filter by person
        </label>
        <select
          id="filter-person"
          value={filterPersonId}
          onChange={(e) => setFilterPersonId(e.target.value)}
          style={selectStyle}
        >
          <option value="">All people</option>
          {people.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>
      </div>

      {!hasReminders ? (
        <div
          className="card card--subtle"
          style={{ padding: '2.6rem 2.4rem', textAlign: 'center' }}
        >
          <p
            className="serif"
            style={{ fontSize: '1.5rem', color: 'var(--text-primary)', marginBottom: '0.75rem' }}
          >
            No reminders yet
          </p>
          <p style={{ fontSize: '0.9rem', color: '#747a84', marginBottom: '1.5rem', maxWidth: '24rem', marginLeft: 'auto', marginRight: 'auto' }}>
            Set a reminder so you never forget to follow up with the people who matter.
          </p>
          <Link href="/reminders/new">
            <button
              className="btn-primary"
              style={{ borderRadius: '50px' }}
            >
              Create your first reminder
            </button>
          </Link>
        </div>
      ) : (
        <>
          {overdueAndToday.length > 0 && (
            <section>
              <h2 style={{ fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#747a84', marginBottom: '0.75rem' }}>
                Overdue & today
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {overdueAndToday.map((r) => renderCard(r, true))}
              </div>
            </section>
          )}
          {upcoming.length > 0 && (
            <section>
              <h2 style={{ fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#747a84', marginBottom: '0.75rem' }}>
                Upcoming
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {upcoming.map((r) => renderCard(r, false))}
              </div>
            </section>
          )}
        </>
      )}
    </div>
  )
}
