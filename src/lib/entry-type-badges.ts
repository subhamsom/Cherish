/**
 * Badge styles for entry/moment types in cards.
 * Use for "Moments you've saved" and person profile entry lists.
 */
export const ENTRY_TYPE_LABELS: Record<string, string> = {
  moment: 'Moment',
  gift_given: 'Gift given',
  gift_received: 'Gift received',
  reminder_note: 'Note',
}

const BADGE_STYLES: Record<string, { background: string; color: string }> = {
  moment: { background: '#EDE9FE', color: '#7C3AED' },
  gift_given: { background: '#D1FAE5', color: '#065F46' },
  gift_received: { background: '#FCE7F3', color: '#9D174D' },
  reminder_note: { background: '#F3F4F6', color: '#374151' },
}

const DEFAULT_BADGE = { background: '#F3F4F6', color: '#374151' }

export function getEntryTypeBadgeStyle(type: string): { background: string; color: string } {
  return BADGE_STYLES[type] ?? DEFAULT_BADGE
}

export function getEntryTypeLabel(type: string): string {
  return ENTRY_TYPE_LABELS[type] ?? type.replace('_', ' ')
}
