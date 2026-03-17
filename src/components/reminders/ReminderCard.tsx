'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Pencil, Check, Clock, Trash2, Repeat } from 'lucide-react'
import type { ReminderWithDetails } from '@/types'
import {
  RELATIONSHIP_COLORS,
  REPEAT_LABELS,
  getReminderStatus,
  formatRemindAt,
  formatSnoozedUntil,
  type ReminderStatus,
} from '@/lib/reminders'
import SnoozePopover from './SnoozePopover'
import ConfirmDialog from '@/components/ui/ConfirmDialog'

const STATUS_LABELS: Record<ReminderStatus, string> = {
  overdue: 'Overdue',
  due: 'Due',
  upcoming: 'Upcoming',
  done: 'Done',
  snoozed: 'Snoozed',
}

const STATUS_STYLES: Record<ReminderStatus, React.CSSProperties> = {
  overdue: { background: 'rgba(220, 38, 38, 0.12)', color: '#DC2626', fontWeight: 600 },
  due: { background: 'rgba(234, 88, 12, 0.12)', color: '#EA580C', fontWeight: 600 },
  upcoming: { background: 'rgba(99, 102, 241, 0.12)', color: '#6366F1' },
  done: { background: 'rgba(22, 163, 74, 0.12)', color: '#16A34A' },
  snoozed: { background: 'rgba(107, 114, 128, 0.12)', color: '#6B7280' },
}

interface ReminderCardProps {
  reminder: ReminderWithDetails
  onEdit: (reminder: ReminderWithDetails) => void
  onMarkDone: (id: string) => void | Promise<void>
  onSnooze: (id: string, newRemindAt: string) => void | Promise<void>
  onDelete: (id: string) => void | Promise<void>
  busy?: boolean
}

function entrySnippet(body: string | null | undefined, maxLen = 80): string {
  if (!body || !body.trim()) return ''
  const t = body.replace(/\s+/g, ' ').trim()
  return t.length <= maxLen ? t : t.slice(0, maxLen) + '…'
}

export default function ReminderCard({
  reminder,
  onEdit,
  onMarkDone,
  onSnooze,
  onDelete,
  busy = false,
}: ReminderCardProps) {
  const [snoozeOpen, setSnoozeOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const status = getReminderStatus(reminder)
  const isOverdue = status === 'overdue'
  const isDone = status === 'done'
  const isSnoozed = status === 'snoozed'
  const personName = reminder.people?.name ?? null
  const relType = reminder.people?.relationship_type ?? 'other'
  const dotColor = RELATIONSHIP_COLORS[relType] ?? RELATIONSHIP_COLORS.other
  const displayTime = reminder.snoozed_until
    ? formatSnoozedUntil(reminder.snoozed_until)
    : formatRemindAt(reminder.remind_at)
  const rawEntries = reminder.entries ?? reminder.entry
  const linkedEntry = Array.isArray(rawEntries) ? rawEntries[0] : rawEntries
  const snippet = linkedEntry?.body
    ? entrySnippet(linkedEntry.body)
    : linkedEntry?.title
      ? linkedEntry.title
      : ''

  const statusLabel =
    status === 'snoozed' && reminder.snoozed_until
      ? `Snoozed until ${formatSnoozedUntil(reminder.snoozed_until)}`
      : STATUS_LABELS[status]

  return (
    <>
      <motion.div
        layout
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, height: 0 }}
        transition={{ type: 'tween', duration: 0.2 }}
        style={{
          background: 'var(--card-bg)',
          border: '1px solid var(--card-border)',
          borderRadius: '12px',
          padding: '1rem 1.25rem',
          borderLeft: isOverdue ? '4px solid #DC2626' : undefined,
          boxShadow: isOverdue
            ? '0 2px 8px rgba(220, 38, 38, 0.12)'
            : '0 1px 4px rgba(124, 58, 237, 0.06)',
          transition: 'box-shadow 0.2s ease, border-color 0.2s ease',
        }}
      >
        {/* Title — bold, prominent */}
        <h3
          style={{
            fontSize: '1rem',
            fontWeight: 700,
            color: 'var(--text-primary)',
            margin: '0 0 0.5rem 0',
            lineHeight: 1.3,
          }}
        >
          {reminder.title}
        </h3>

        {/* Person + relationship badge */}
        {personName && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.35rem' }}>
            <span
              style={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                backgroundColor: dotColor,
                flexShrink: 0,
              }}
            />
            <span style={{ fontSize: '0.875rem', color: '#4B5563' }}>{personName}</span>
            <span
              style={{
                fontSize: '0.7rem',
                padding: '0.15rem 0.45rem',
                borderRadius: '6px',
                background: `${dotColor}22`,
                color: dotColor,
                fontWeight: 500,
                textTransform: 'capitalize',
              }}
            >
              {relType}
            </span>
          </div>
        )}

        {/* Due date/time — red if overdue */}
        <p
          style={{
            fontSize: '0.8rem',
            margin: '0 0 0.5rem 0',
            color: isOverdue ? '#DC2626' : '#6B7280',
            fontWeight: isOverdue ? 600 : 400,
          }}
        >
          {displayTime}
        </p>

        {/* Repeat + Status row */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', alignItems: 'center', marginBottom: '0.75rem' }}>
          {reminder.repeat !== 'none' && (
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.25rem',
                fontSize: '0.7rem',
                padding: '0.2rem 0.5rem',
                borderRadius: '6px',
                background: 'rgba(124, 58, 237, 0.12)',
                color: 'var(--accent)',
                fontWeight: 500,
              }}
            >
              <Repeat size={12} strokeWidth={2} />
              {REPEAT_LABELS[reminder.repeat]}
            </span>
          )}
          <span
            style={{
              fontSize: '0.7rem',
              padding: '0.2rem 0.5rem',
              borderRadius: '6px',
              ...STATUS_STYLES[status],
            }}
          >
            {statusLabel}
          </span>
        </div>

        {/* Optional entry snippet */}
        {snippet && (
          <p
            style={{
              fontSize: '0.8rem',
              color: '#6B7280',
              margin: '0 0 0.75rem 0',
              lineHeight: 1.4,
              fontStyle: 'italic',
            }}
          >
            “{snippet}”
          </p>
        )}

        {/* Quick actions */}
        {!reminder.deleted_at && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.25rem',
              flexWrap: 'wrap',
            }}
          >
            <button
              type="button"
              onClick={() => onEdit(reminder)}
              disabled={busy}
              aria-label="Edit reminder"
              style={iconButtonStyle(busy)}
            >
              <Pencil size={16} strokeWidth={2} />
            </button>
            {!isDone && (
              <button
                type="button"
                onClick={() => onMarkDone(reminder.id)}
                disabled={busy}
                aria-label="Mark done"
                style={iconButtonStyle(busy)}
              >
                <Check size={16} strokeWidth={2} />
              </button>
            )}
            {!isDone && (
              <SnoozePopover
                reminder={reminder}
                anchor={<Clock size={16} strokeWidth={2} />}
                open={snoozeOpen}
                onOpenChange={setSnoozeOpen}
                onSnooze={onSnooze}
                disabled={busy}
              />
            )}
            <button
              type="button"
              onClick={() => setDeleteOpen(true)}
              disabled={busy}
              aria-label="Delete reminder"
              style={{ ...iconButtonStyle(busy), color: '#DC2626' }}
            >
              <Trash2 size={16} strokeWidth={2} />
            </button>
          </div>
        )}
      </motion.div>

      <ConfirmDialog
        open={deleteOpen}
        title="Delete reminder"
        message="Are you sure you want to delete this reminder? You can't undo this."
        confirmLabel="Delete"
        cancelLabel="Cancel"
        danger
        onConfirm={async () => {
          await onDelete(reminder.id)
          setDeleteOpen(false)
        }}
        onCancel={() => setDeleteOpen(false)}
      />
    </>
  )
}

function iconButtonStyle(disabled: boolean): React.CSSProperties {
  return {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 36,
    height: 36,
    padding: 0,
    border: '1px solid var(--card-border)',
    borderRadius: '8px',
    background: 'transparent',
    color: '#6B7280',
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.6 : 1,
    transition: 'background 0.15s ease, color 0.15s ease',
  }
}
