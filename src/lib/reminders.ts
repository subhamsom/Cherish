import type { Reminder } from '@/types'

export const RELATIONSHIP_COLORS: Record<string, string> = {
  partner: '#F9A8D4',
  friend: '#93C5FD',
  family: '#86EFAC',
  colleague: '#FCD34D',
  other: '#C4B5FD',
}

export const REPEAT_LABELS: Record<string, string> = {
  none: '',
  weekly: 'Weekly',
  monthly: 'Monthly',
  yearly: 'Yearly',
}

export type ReminderStatus = 'overdue' | 'due' | 'upcoming' | 'done' | 'snoozed'

export function getReminderStatus(r: Reminder): ReminderStatus {
  if (r.deleted_at) return 'done' // treat deleted as done for display
  if (r.is_sent) return 'done'
  const now = new Date()
  const remindAt = new Date(r.remind_at)
  const snoozedUntil = r.snoozed_until ? new Date(r.snoozed_until) : null
  if (snoozedUntil && snoozedUntil > now) return 'snoozed'
  if (remindAt < now) return 'overdue'
  const todayEnd = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999)
  if (remindAt <= todayEnd) return 'due'
  return 'upcoming'
}

export function formatRemindAt(iso: string): string {
  const d = new Date(iso)
  const dateStr = d.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' })
  const timeStr = d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })
  return `${dateStr} · ${timeStr}`
}

export function formatRemindAtShort(iso: string): string {
  const d = new Date(iso)
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
}

export function formatSnoozedUntil(iso: string): string {
  const d = new Date(iso)
  return d.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short', hour: 'numeric', minute: '2-digit', hour12: true })
}

/** For notification dropdown: "Due today" or "Overdue by N days" */
export function formatReminderDueLabel(remindAtIso: string): string {
  const now = new Date()
  const remindAt = new Date(remindAtIso)
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0)
  const todayEnd = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999)
  if (remindAt >= todayStart && remindAt <= todayEnd) return 'Due today'
  if (remindAt < now) {
    const diffMs = todayStart.getTime() - remindAt.getTime()
    const diffDays = Math.ceil(diffMs / (24 * 60 * 60 * 1000))
    return diffDays <= 1 ? 'Overdue by 1 day' : `Overdue by ${diffDays} days`
  }
  return formatRemindAtShort(remindAtIso)
}

/** Calendar color by status */
export const STATUS_CALENDAR_COLORS: Record<ReminderStatus, string> = {
  overdue: '#DC2626',
  due: '#EA580C',
  upcoming: '#6366F1',
  done: '#16A34A',
  snoozed: '#6B7280',
}
