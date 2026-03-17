'use client'

import { useState, useRef, useEffect } from 'react'
import { Clock } from 'lucide-react'
import type { ReminderWithDetails } from '@/types'

interface SnoozePopoverProps {
  reminder: ReminderWithDetails
  anchor: React.ReactNode
  open: boolean
  onOpenChange: (open: boolean) => void
  onSnooze: (reminderId: string, newRemindAt: string) => void | Promise<void>
  disabled?: boolean
}

const PRESETS = [
  { label: 'Today', getDate: () => endOfToday() },
  { label: 'Tomorrow', getDate: () => endOfTomorrow() },
  { label: '1 week', getDate: () => addDays(new Date(), 7) },
] as const

function endOfToday(): Date {
  const d = new Date()
  d.setHours(23, 59, 0, 0)
  return d
}

function endOfTomorrow(): Date {
  const d = new Date()
  d.setDate(d.getDate() + 1)
  d.setHours(9, 0, 0, 0)
  return d
}

function addDays(date: Date, days: number): Date {
  const d = new Date(date)
  d.setDate(d.getDate() + days)
  return d
}

export default function SnoozePopover({
  reminder,
  anchor,
  open,
  onOpenChange,
  onSnooze,
  disabled,
}: SnoozePopoverProps) {
  const [customDate, setCustomDate] = useState('')
  const [customTime, setCustomTime] = useState('09:00')
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) onOpenChange(false)
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [open, onOpenChange])

  async function handlePreset(getDate: () => Date) {
    const d = getDate()
    await onSnooze(reminder.id, d.toISOString())
    onOpenChange(false)
  }

  async function handleCustom() {
    if (!customDate.trim()) return
    const [y, m, d] = customDate.split('-').map(Number)
    const [hh, mm] = customTime.split(':').map(Number)
    const date = new Date(y, m - 1, d, hh, mm, 0, 0)
    if (Number.isNaN(date.getTime())) return
    await onSnooze(reminder.id, date.toISOString())
    onOpenChange(false)
  }

  const todayStr = new Date().toISOString().slice(0, 10)

  return (
    <div ref={ref} style={{ position: 'relative', display: 'inline-block' }}>
      <div
        onClick={() => !disabled && onOpenChange(!open)}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: disabled ? 'not-allowed' : 'pointer',
          opacity: disabled ? 0.6 : 1,
          padding: '0.35rem',
          borderRadius: '8px',
          color: '#6B7280',
        }}
        aria-expanded={open}
        aria-haspopup="true"
      >
        {anchor}
      </div>
      {open && (
        <div
          role="menu"
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            marginTop: '4px',
            minWidth: '200px',
            background: '#FFFFFF',
            border: '1px solid var(--card-border)',
            borderRadius: '12px',
            boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
            zIndex: 50,
            padding: '0.5rem',
          }}
        >
          {PRESETS.map((preset) => (
            <button
              key={preset.label}
              type="button"
              role="menuitem"
              onClick={() => handlePreset(preset.getDate)}
              style={{
                width: '100%',
                padding: '0.5rem 0.75rem',
                border: 'none',
                background: 'transparent',
                borderRadius: '8px',
                textAlign: 'left',
                fontSize: '0.875rem',
                color: 'var(--text-primary)',
                cursor: 'pointer',
                fontFamily: 'Inter, sans-serif',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
              }}
            >
              <Clock size={16} strokeWidth={2} style={{ flexShrink: 0 }} />
              {preset.label}
            </button>
          ))}
          <div style={{ borderTop: '1px solid var(--card-border)', marginTop: '0.25rem', paddingTop: '0.5rem' }}>
            <div style={{ display: 'flex', gap: '0.25rem', marginBottom: '0.35rem' }}>
              <input
                type="date"
                value={customDate}
                onChange={(e) => setCustomDate(e.target.value)}
                min={todayStr}
                style={{
                  flex: 1,
                  padding: '0.4rem 0.5rem',
                  border: '1px solid var(--card-border)',
                  borderRadius: '8px',
                  fontSize: '0.8rem',
                  fontFamily: 'Inter, sans-serif',
                }}
              />
              <input
                type="time"
                value={customTime}
                onChange={(e) => setCustomTime(e.target.value)}
                style={{
                  width: '90px',
                  padding: '0.4rem 0.5rem',
                  border: '1px solid var(--card-border)',
                  borderRadius: '8px',
                  fontSize: '0.8rem',
                  fontFamily: 'Inter, sans-serif',
                }}
              />
            </div>
            <button
              type="button"
              onClick={handleCustom}
              disabled={!customDate.trim()}
              style={{
                width: '100%',
                padding: '0.4rem 0.75rem',
                border: 'none',
                background: 'var(--accent)',
                color: '#fff',
                borderRadius: '8px',
                fontSize: '0.8rem',
                fontWeight: 500,
                cursor: customDate.trim() ? 'pointer' : 'not-allowed',
                opacity: customDate.trim() ? 1 : 0.6,
                fontFamily: 'Inter, sans-serif',
              }}
            >
              Snooze to custom date
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
