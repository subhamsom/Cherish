'use client'

import { useState, useMemo, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ChevronLeft, ChevronRight, ChevronDown } from 'lucide-react'
import type { ReminderWithDetails } from '@/types'
import {
  getReminderStatus,
  STATUS_CALENDAR_COLORS,
  formatRemindAtShort,
} from '@/lib/reminders'
import type { ReminderStatus } from '@/lib/reminders'

interface RemindersCalendarProps {
  reminders: ReminderWithDetails[]
  onOpenReminder: (reminder: ReminderWithDetails) => void
  onMarkDone: (id: string) => void | Promise<void>
  onSnooze: (id: string, newRemindAt: string) => void | Promise<void>
  onDelete: (id: string) => void | Promise<void>
}

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

const YEAR_RANGE = 5 // years before/after current

function getMonthDays(year: number, month: number) {
  const first = new Date(year, month, 1)
  const last = new Date(year, month + 1, 0)
  const startPad = first.getDay()
  const daysInMonth = last.getDate()
  const totalCells = Math.ceil((startPad + daysInMonth) / 7) * 7
  const days: (number | null)[] = []
  for (let i = 0; i < startPad; i++) days.push(null)
  for (let d = 1; d <= daysInMonth; d++) days.push(d)
  while (days.length < totalCells) days.push(null)
  return days
}

function sameDay(d: Date, year: number, month: number, day: number) {
  return d.getFullYear() === year && d.getMonth() === month && d.getDate() === day
}

export default function RemindersCalendar({
  reminders,
  onOpenReminder,
}: RemindersCalendarProps) {
  const [viewDate, setViewDate] = useState(() => new Date())
  const year = viewDate.getFullYear()
  const month = viewDate.getMonth()

  const remindersByDay = useMemo(() => {
    const map = new Map<string, ReminderWithDetails[]>()
    const key = (y: number, m: number, d: number) => `${y}-${m}-${d}`

    reminders.forEach((r) => {
      const d = new Date(r.remind_at)
      const k = key(d.getFullYear(), d.getMonth(), d.getDate())
      if (!map.has(k)) map.set(k, [])
      map.get(k)!.push(r)
    })

    return map
  }, [reminders])

  const days = useMemo(() => getMonthDays(year, month), [year, month])
  const today = new Date()
  const isCurrentMonth =
    today.getFullYear() === year && today.getMonth() === month

  const [yearDropdownOpen, setYearDropdownOpen] = useState(false)
  const yearDropdownRef = useRef<HTMLDivElement>(null)
  const years = useMemo(() => {
    const y = today.getFullYear()
    return Array.from({ length: YEAR_RANGE * 2 + 1 }, (_, i) => y - YEAR_RANGE + i)
  }, [])

  useEffect(() => {
    if (!yearDropdownOpen) return
    function handleClickOutside(e: MouseEvent) {
      if (yearDropdownRef.current && !yearDropdownRef.current.contains(e.target as Node)) {
        setYearDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [yearDropdownOpen])

  function prevMonth() {
    setViewDate((d) => new Date(d.getFullYear(), d.getMonth() - 1))
  }

  function nextMonth() {
    setViewDate((d) => new Date(d.getFullYear(), d.getMonth() + 1))
  }

  function setYear(y: number) {
    setViewDate((d) => new Date(y, d.getMonth(), 1))
    setYearDropdownOpen(false)
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2 }}
      style={{
        background: 'var(--card-bg)',
        border: '1px solid var(--card-border)',
        borderRadius: '16px',
        padding: '1.25rem',
        overflow: 'hidden',
      }}
    >
      {/* Month nav + year skip */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '1rem',
          flexWrap: 'wrap',
          gap: '0.5rem',
        }}
      >
        <button
          type="button"
          onClick={prevMonth}
          aria-label="Previous month"
          style={navButtonStyle}
        >
          <ChevronLeft size={20} strokeWidth={2} />
        </button>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }} ref={yearDropdownRef}>
          <h2
            className="serif"
            style={{
              fontSize: '1.35rem',
              fontWeight: 700,
              color: 'var(--text-primary)',
              margin: 0,
            }}
          >
            {viewDate.toLocaleDateString('en-GB', { month: 'long' })}
          </h2>
          <div style={{ position: 'relative' }}>
            <button
              type="button"
              onClick={() => setYearDropdownOpen((o) => !o)}
              aria-expanded={yearDropdownOpen}
              aria-haspopup="listbox"
              aria-label="Select year"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '2px',
                padding: '0.35rem 0.5rem',
                border: '1px solid var(--card-border)',
                borderRadius: '8px',
                background: 'var(--card-bg)',
                color: 'var(--text-primary)',
                fontSize: '1rem',
                fontWeight: 600,
                cursor: 'pointer',
                fontFamily: 'inherit',
              }}
            >
              {year}
              <ChevronDown size={16} strokeWidth={2} style={{ opacity: 0.7 }} />
            </button>
            {yearDropdownOpen && (
              <div
                role="listbox"
                style={{
                  position: 'absolute',
                  top: '100%',
                  left: 0,
                  marginTop: '4px',
                  minWidth: '80px',
                  maxHeight: '220px',
                  overflowY: 'auto',
                  background: '#fff',
                  border: '1px solid var(--card-border)',
                  borderRadius: '10px',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                  zIndex: 50,
                  padding: '4px',
                }}
              >
                {years.map((y) => (
                  <button
                    key={y}
                    role="option"
                    aria-selected={y === year}
                    type="button"
                    onClick={() => setYear(y)}
                    style={{
                      display: 'block',
                      width: '100%',
                      padding: '0.4rem 0.6rem',
                      border: 'none',
                      borderRadius: '6px',
                      background: y === year ? 'rgba(124, 58, 237, 0.15)' : 'transparent',
                      color: y === year ? 'var(--accent)' : 'var(--text-primary)',
                      fontSize: '0.9rem',
                      fontWeight: y === year ? 600 : 400,
                      cursor: 'pointer',
                      textAlign: 'left',
                      fontFamily: 'Inter, sans-serif',
                    }}
                  >
                    {y}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
        <button
          type="button"
          onClick={nextMonth}
          aria-label="Next month"
          style={navButtonStyle}
        >
          <ChevronRight size={20} strokeWidth={2} />
        </button>
      </div>

      {/* Weekday headers — minmax(0,1fr) so all 7 columns get equal width and Sat isn't collapsed */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(7, minmax(0, 1fr))',
          gap: '2px',
          marginBottom: '4px',
        }}
      >
        {WEEKDAYS.map((w) => (
          <div
            key={w}
            style={{
              fontSize: '0.7rem',
              fontWeight: 600,
              color: '#6B7280',
              textAlign: 'center',
              padding: '0.25rem 0',
            }}
          >
            {w}
          </div>
        ))}
      </div>

      {/* Day grid — minmax(0,1fr) so all 7 columns (including Sat) get equal width */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(7, minmax(0, 1fr))',
          gap: '4px',
        }}
      >
        {days.map((day, i) => {
          const isToday =
            isCurrentMonth &&
            day !== null &&
            sameDay(today, year, month, day)
          const dayKey =
            day !== null ? `${year}-${month}-${day}` : `empty-${i}`
          const dayReminders = day !== null ? remindersByDay.get(dayKey) ?? [] : []

          if (day === null) {
            return <div key={dayKey} style={{ minHeight: 96, minWidth: 0 }} />
          }

          return (
            <div
              key={dayKey}
              style={{
                minHeight: 96,
                minWidth: 0,
                background: isToday ? 'rgba(124, 58, 237, 0.08)' : 'transparent',
                border: isToday ? '2px solid var(--accent)' : '1px solid transparent',
                borderRadius: '10px',
                padding: '6px',
                transition: 'background 0.15s ease, border-color 0.15s ease',
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  fontSize: '0.85rem',
                  fontWeight: isToday ? 700 : 500,
                  color: isToday ? 'var(--accent)' : 'var(--text-primary)',
                  marginBottom: '4px',
                  flexShrink: 0,
                }}
              >
                {day}
              </div>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '4px',
                  minHeight: 0,
                  flex: 1,
                  overflow: 'hidden',
                }}
              >
                {dayReminders.slice(0, 3).map((r) => {
                  const status = getReminderStatus(r)
                  const color = STATUS_CALENDAR_COLORS[status]
                  return (
                    <button
                      key={r.id}
                      type="button"
                      onClick={() => onOpenReminder(r)}
                      style={{
                        display: 'block',
                        width: '100%',
                        minWidth: 0,
                        padding: '4px 6px',
                        border: 'none',
                        borderRadius: '6px',
                        background: `${color}22`,
                        color: color,
                        fontSize: '0.7rem',
                        fontWeight: 500,
                        textAlign: 'left',
                        cursor: 'pointer',
                        fontFamily: 'Inter, sans-serif',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        transition: 'opacity 0.15s ease',
                        flexShrink: 0,
                      }}
                      title={`${r.title} — ${formatRemindAtShort(r.remind_at)}`}
                    >
                      {r.title}
                    </button>
                  )
                })}
                {dayReminders.length > 3 && (
                  <span
                    style={{
                      fontSize: '0.7rem',
                      color: '#6B7280',
                      paddingLeft: '4px',
                      flexShrink: 0,
                    }}
                  >
                    +{dayReminders.length - 3} more
                  </span>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* Legend */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '0.75rem',
          marginTop: '1rem',
          paddingTop: '1rem',
          borderTop: '1px solid var(--card-border)',
        }}
      >
        {(
          [
            ['overdue', 'Overdue'],
            ['due', 'Due'],
            ['upcoming', 'Upcoming'],
            ['done', 'Done'],
            ['snoozed', 'Snoozed'],
          ] as const
        ).map(([status, label]) => (
          <div
            key={status}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
              fontSize: '0.75rem',
              color: '#6B7280',
            }}
          >
            <span
              style={{
                width: 10,
                height: 10,
                borderRadius: '4px',
                background: STATUS_CALENDAR_COLORS[status as ReminderStatus],
              }}
            />
            {label}
          </div>
        ))}
      </div>
    </motion.div>
  )
}

const navButtonStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: 40,
  height: 40,
  padding: 0,
  border: '1px solid var(--card-border)',
  borderRadius: '10px',
  background: 'transparent',
  color: 'var(--text-primary)',
  cursor: 'pointer',
  transition: 'background 0.15s ease, color 0.15s ease',
}
