'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import type { Person } from '@/types'
import type { Entry } from '@/types'
import Select from '@/components/ui/Select'
import DatePicker from '@/components/ui/DatePicker'

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

function getDefaultDateTime() {
  const d = new Date()
  d.setDate(d.getDate() + 1)
  d.setHours(9, 0, 0, 0)
  return {
    date: d,
    hour: '9',
    minute: '00',
    period: 'AM' as 'AM' | 'PM',
  }
}

export default function ReminderForm() {
  const router = useRouter()
  const supabase = createClient()

  const [people, setPeople] = useState<Person[]>([])
  const [entries, setEntries] = useState<Pick<Entry, 'id' | 'title' | 'date'>[]>([])
  const [title, setTitle] = useState('')
  const [personId, setPersonId] = useState('')
  const defaultDateTime = getDefaultDateTime()
  const [remindDate, setRemindDate] = useState<Date | null>(defaultDateTime.date)
  const [remindHour, setRemindHour] = useState<string>(defaultDateTime.hour)
  const [remindMinute, setRemindMinute] = useState<string>(defaultDateTime.minute)
  const [remindPeriod, setRemindPeriod] = useState<'AM' | 'PM'>(defaultDateTime.period)
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

    if (!remindDate) {
      setError('Please choose a date.')
      setLoading(false)
      return
    }

    const hourNum = parseInt(remindHour, 10)
    const minuteNum = parseInt(remindMinute, 10)
    if (
      Number.isNaN(hourNum) ||
      Number.isNaN(minuteNum) ||
      hourNum < 1 ||
      hourNum > 12 ||
      !['00', '15', '30', '45'].includes(remindMinute)
    ) {
      setError('Please choose a valid time.')
      setLoading(false)
      return
    }

    let hours24 = hourNum % 12
    if (remindPeriod === 'PM') {
      hours24 += 12
    }

    const remindAtDate = new Date(remindDate)
    remindAtDate.setHours(hours24, minuteNum, 0, 0)

    const payload = {
      user_id: user.id,
      person_id: personId,
      entry_id: entryId || null,
      title: title.trim(),
      remind_at: remindAtDate.toISOString(),
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
          <Select
            options={people.map((p) => ({
              value: p.id,
              label: p.name,
            }))}
            value={personId}
            onChange={setPersonId}
            placeholder="Select a person…"
          />
        </div>

        <div>
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '0.75rem',
              alignItems: 'flex-start',
            }}
          >
            <div style={{ flex: '1 1 220px', minWidth: '220px', maxWidth: '100%' }}>
              <label className="label" htmlFor="remind_date">
                DATE
              </label>
              <DatePicker
                value={remindDate}
                onChange={setRemindDate}
                minDate={new Date()}
                placeholder="Select date…"
              />
            </div>
            <div style={{ flex: '1 1 200px', minWidth: '200px', maxWidth: '100%' }}>
              <label className="label" htmlFor="remind_time">
                TIME
              </label>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.25rem',
                  flexWrap: 'nowrap',
                }}
              >
                <Select
                  options={Array.from({ length: 12 }, (_, i) => {
                    const h = i + 1
                    return { value: String(h), label: String(h) }
                  })}
                  value={remindHour}
                  onChange={setRemindHour}
                  width={64}
                />
                <span style={{ fontSize: '0.9rem', color: '#1F1F1F' }}>:</span>
                <Select
                  options={['00', '15', '30', '45'].map((m) => ({
                    value: m,
                    label: m,
                  }))}
                  value={remindMinute}
                  onChange={setRemindMinute}
                  width={64}
                />
                <Select
                  options={[
                    { value: 'AM', label: 'AM' },
                    { value: 'PM', label: 'PM' },
                  ]}
                  value={remindPeriod}
                  onChange={(val) => setRemindPeriod(val as 'AM' | 'PM')}
                  width={72}
                />
              </div>
            </div>
          </div>
        </div>

        <div>
          <label className="label" htmlFor="repeat">
            Repeat
          </label>
          <Select
            options={REPEAT_OPTIONS.map((opt) => ({
              value: opt.value,
              label: opt.label,
            }))}
            value={repeat}
            onChange={(val) => setRepeat(val as typeof repeat)}
          />
        </div>

        <div>
          <label className="label" htmlFor="channel">
            Channel
          </label>
          <Select
            options={CHANNEL_OPTIONS.map((opt) => ({
              value: opt.value,
              label: opt.label,
            }))}
            value={channel}
            onChange={(val) => setChannel(val as typeof channel)}
          />
        </div>

        <div>
          <label className="label" htmlFor="entry">
            Link to entry (optional)
          </label>
          <Select
            options={[
              { value: '', label: 'None' },
              ...entries.map((entry) => ({
                value: entry.id,
                label: `${entry.title}${entry.date ? ` — ${entry.date}` : ''}`,
              })),
            ]}
            value={entryId}
            onChange={setEntryId}
            disabled={!personId}
          />
        </div>

        {error && (
          <p style={{ fontSize: '0.8rem', color: '#C0392B', margin: 0 }}>
            {error}
          </p>
        )}

        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          <button
            type="submit"
            disabled={loading || !title.trim() || !personId || !remindDate}
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
