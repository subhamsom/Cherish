'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { LayoutList, Calendar as CalendarIcon } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import ReminderCard from './ReminderCard'
import ReminderModal from './ReminderModal'
import RemindersCalendar from './RemindersCalendar'
import Toast, { type ToastItem } from '@/components/ui/Toast'
import type { Person } from '@/types'
import type { ReminderWithDetails } from '@/types'

export type ListFilter = 'all' | 'active' | 'done' | 'deleted'
export type ViewMode = 'list' | 'calendar'

async function fetchReminders(supabase: ReturnType<typeof createClient>) {
  const { data, error } = await supabase
    .from('reminders')
    .select(
      '*, people(name, relationship_type), entries(id, title, body, date)'
    )
    .order('remind_at', { ascending: true })

  if (error) {
    console.error('[Reminders] fetch error:', error)
    return []
  }
  return (data ?? []) as ReminderWithDetails[]
}

function filterReminders(
  reminders: ReminderWithDetails[],
  filter: ListFilter
): ReminderWithDetails[] {
  switch (filter) {
    case 'all':
      return reminders.filter((r) => !r.deleted_at)
    case 'active': {
      const now = new Date()
      return reminders.filter(
        (r) =>
          !r.deleted_at &&
          !r.is_sent &&
          (!r.snoozed_until || new Date(r.snoozed_until) <= now)
      )
    }
    case 'done':
      return reminders.filter((r) => !r.deleted_at && r.is_sent)
    case 'deleted':
      return reminders.filter((r) => Boolean(r.deleted_at))
    default:
      return reminders.filter((r) => !r.deleted_at)
  }
}

export default function RemindersList() {
  const supabase = createClient()
  const [reminders, setReminders] = useState<ReminderWithDetails[]>([])
  const [people, setPeople] = useState<Person[]>([])
  const [viewMode, setViewMode] = useState<ViewMode>('list')
  const [listFilter, setListFilter] = useState<ListFilter>('all')
  const [modalOpen, setModalOpen] = useState(false)
  const [editingReminder, setEditingReminder] = useState<ReminderWithDetails | null>(null)
  const [loading, setLoading] = useState(true)
  const [actioningId, setActioningId] = useState<string | null>(null)
  const [toast, setToast] = useState<ToastItem | null>(null)

  const refresh = useCallback(() => {
    fetchReminders(supabase).then(setReminders)
  }, [])

  useEffect(() => {
    refresh()
    supabase
      .from('people')
      .select('id, name')
      .order('name')
      .then(({ data }) => setPeople((data as Person[]) ?? []))
    setLoading(false)
  }, [refresh])

  const filtered = filterReminders(reminders, listFilter)

  function openNew() {
    setEditingReminder(null)
    setModalOpen(true)
  }

  function openEdit(reminder: ReminderWithDetails) {
    setEditingReminder(reminder)
    setModalOpen(true)
  }

  function closeModal() {
    setModalOpen(false)
    setEditingReminder(null)
    refresh()
  }

  async function handleMarkDone(id: string) {
    const prev = reminders.find((r) => r.id === id)
    setActioningId(id)
    await supabase.from('reminders').update({ is_sent: true }).eq('id', id)
    await refresh()
    setActioningId(null)
    if (prev) {
      setToast({
        id: `done-${Date.now()}`,
        message: 'Reminder marked done',
        undo: async () => {
          await supabase.from('reminders').update({ is_sent: false }).eq('id', id)
          refresh()
        },
      })
    }
  }

  async function handleSnooze(id: string, newRemindAt: string) {
    const prev = reminders.find((r) => r.id === id)
    setActioningId(id)
    await supabase
      .from('reminders')
      .update({ remind_at: newRemindAt, snoozed_until: null })
      .eq('id', id)
    await refresh()
    setActioningId(null)
    if (prev) {
      setToast({
        id: `snooze-${Date.now()}`,
        message: 'Reminder snoozed',
        undo: async () => {
          if (prev) {
            await supabase
              .from('reminders')
              .update({ remind_at: prev.remind_at })
              .eq('id', id)
            refresh()
          }
        },
      })
    }
  }

  async function handleDelete(id: string) {
    const prev = reminders.find((r) => r.id === id)
    setActioningId(id)
    // Soft delete: requires reminders.deleted_at (timestamptz, nullable) in Supabase
    await supabase
      .from('reminders')
      .update({ deleted_at: new Date().toISOString() })
      .eq('id', id)
    await refresh()
    setActioningId(null)
    if (prev) {
      setToast({
        id: `delete-${Date.now()}`,
        message: 'Reminder deleted',
        undo: async () => {
          await supabase.from('reminders').update({ deleted_at: null }).eq('id', id)
          refresh()
        },
      })
    }
  }

  const filterTabs: { value: ListFilter; label: string }[] = [
    { value: 'all', label: 'All' },
    { value: 'active', label: 'Active' },
    { value: 'done', label: 'Done' },
    { value: 'deleted', label: 'Deleted' },
  ]

  if (loading) {
    return (
      <p style={{ fontSize: '0.9rem', color: '#747a84' }}>Loading reminders…</p>
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* New reminder + View toggle + List filter (when list view) */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          gap: '0.75rem',
        }}
      >
        <button
          type="button"
          onClick={openNew}
          className="btn-primary"
          style={{
            borderRadius: '50px',
            padding: '0.5rem 1rem',
            fontSize: '0.875rem',
            fontWeight: 500,
            display: 'flex',
            alignItems: 'center',
            gap: '0.35rem',
          }}
        >
          New reminder
        </button>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            border: '1px solid var(--card-border)',
            borderRadius: '10px',
            overflow: 'hidden',
            background: 'var(--card-bg)',
          }}
        >
          <button
            type="button"
            onClick={() => setViewMode('list')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
              padding: '0.5rem 0.75rem',
              border: 'none',
              background: viewMode === 'list' ? 'var(--accent)' : 'transparent',
              color: viewMode === 'list' ? '#fff' : '#6B7280',
              fontSize: '0.875rem',
              fontWeight: 500,
              cursor: 'pointer',
              fontFamily: 'Inter, sans-serif',
            }}
          >
            <LayoutList size={18} strokeWidth={2} />
            List
          </button>
          <button
            type="button"
            onClick={() => setViewMode('calendar')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
              padding: '0.5rem 0.75rem',
              border: 'none',
              background: viewMode === 'calendar' ? 'var(--accent)' : 'transparent',
              color: viewMode === 'calendar' ? '#fff' : '#6B7280',
              fontSize: '0.875rem',
              fontWeight: 500,
              cursor: 'pointer',
              fontFamily: 'Inter, sans-serif',
            }}
          >
            <CalendarIcon size={18} strokeWidth={2} />
            Calendar
          </button>
        </div>

        {viewMode === 'list' && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.25rem' }}>
            {filterTabs.map((tab) => (
              <button
                key={tab.value}
                type="button"
                onClick={() => setListFilter(tab.value)}
                style={{
                  padding: '0.4rem 0.65rem',
                  border: 'none',
                  borderRadius: '8px',
                  background: listFilter === tab.value ? 'rgba(124, 58, 237, 0.15)' : 'transparent',
                  color: listFilter === tab.value ? 'var(--accent)' : '#6B7280',
                  fontSize: '0.8rem',
                  fontWeight: 500,
                  cursor: 'pointer',
                  fontFamily: 'Inter, sans-serif',
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Content */}
      {viewMode === 'list' ? (
        <>
          {filtered.length === 0 ? (
            <div
              className="card card--subtle"
              style={{ padding: '2.6rem 2.4rem', textAlign: 'center' }}
            >
              <p
                className="serif"
                style={{
                  fontSize: '1.5rem',
                  color: 'var(--text-primary)',
                  marginBottom: '0.75rem',
                }}
              >
                {listFilter === 'deleted'
                  ? 'No deleted reminders'
                  : listFilter === 'done'
                    ? 'No completed reminders'
                    : listFilter === 'active'
                      ? 'No active reminders'
                      : 'No reminders yet'}
              </p>
              <p
                style={{
                  fontSize: '0.9rem',
                  color: '#747a84',
                  marginBottom: '1.5rem',
                  maxWidth: '24rem',
                  marginLeft: 'auto',
                  marginRight: 'auto',
                }}
              >
                {listFilter === 'all' || listFilter === 'active'
                  ? 'Set a reminder so you never forget to follow up with the people who matter.'
                  : ''}
              </p>
              {(listFilter === 'all' || listFilter === 'active') && (
                <button
                  type="button"
                  className="btn-primary"
                  style={{ borderRadius: '50px' }}
                  onClick={openNew}
                >
                  Create your first reminder
                </button>
              )}
            </div>
          ) : (
            <motion.div
              layout
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 320px), 1fr))',
                gap: '1rem',
              }}
            >
              <AnimatePresence mode="popLayout">
                {filtered.map((r) => (
                  <ReminderCard
                    key={r.id}
                    reminder={r}
                    onEdit={openEdit}
                    onMarkDone={handleMarkDone}
                    onSnooze={handleSnooze}
                    onDelete={handleDelete}
                    busy={actioningId === r.id}
                  />
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </>
      ) : (
        <RemindersCalendar
          reminders={reminders.filter((r) => !r.deleted_at)}
          onOpenReminder={openEdit}
          onMarkDone={handleMarkDone}
          onSnooze={handleSnooze}
          onDelete={handleDelete}
        />
      )}

      <ReminderModal
        isOpen={modalOpen}
        onClose={closeModal}
        editingReminder={editingReminder}
      />

      <Toast item={toast} onDismiss={() => setToast(null)} />
    </div>
  )
}
