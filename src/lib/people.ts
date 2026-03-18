/**
 * Shared design tokens and helpers for the People section.
 */

export const RELATIONSHIP_COLORS: Record<string, string> = {
  partner: '#F9A8D4',
  friend: '#93C5FD',
  family: '#86EFAC',
  colleague: '#FCD34D',
  other: '#C4B5FD',
}

/** Soft background tint for relationship (for cards/hero) */
export const RELATIONSHIP_BG: Record<string, string> = {
  partner: 'rgba(249, 168, 212, 0.12)',
  friend: 'rgba(147, 197, 253, 0.12)',
  family: 'rgba(134, 239, 172, 0.12)',
  colleague: 'rgba(252, 211, 77, 0.12)',
  other: 'rgba(196, 181, 253, 0.12)',
}

export function formatBirthday(iso: string): string {
  const d = iso.length === 10 ? new Date(`${iso}T12:00:00`) : new Date(iso)
  if (Number.isNaN(d.getTime())) return ''
  return d.toLocaleDateString('en-GB', { month: 'short', day: 'numeric' })
}

export function formatBirthdayLong(iso: string): string {
  const d = iso.length === 10 ? new Date(`${iso}T12:00:00`) : new Date(iso)
  if (Number.isNaN(d.getTime())) return ''
  return d.toLocaleDateString('en-GB', { month: 'long', day: 'numeric' })
}

export function formatDayMonth(input: string): string {
  const d = input.length === 10 ? new Date(`${input}T12:00:00`) : new Date(input)
  if (Number.isNaN(d.getTime())) return ''
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
}
