'use client'

import { useState, useRef, useEffect } from 'react'

interface BirthdayDatePickerProps {
  id?: string
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
}

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

function toYYYYMMDD(d: Date): string {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

function todayStr(): string {
  return toYYYYMMDD(new Date())
}

function getDaysInMonth(year: number, month: number): Date[] {
  const first = new Date(year, month, 1)
  const last = new Date(year, month + 1, 0)
  const days: Date[] = []
  for (let d = new Date(first); d <= last; d.setDate(d.getDate() + 1)) {
    days.push(new Date(d))
  }
  return days
}

function getStartPadding(year: number, month: number): number {
  return new Date(year, month, 1).getDay()
}

export default function BirthdayDatePicker({ id, value, onChange, placeholder = 'Pick a date', className = '' }: BirthdayDatePickerProps) {
  const [open, setOpen] = useState(false)
  const [viewDate, setViewDate] = useState<Date>(() => (value ? new Date(value + 'T12:00:00') : new Date()))
  const containerRef = useRef<HTMLDivElement>(null)
  const maxDate = todayStr()

  useEffect(() => {
    if (value) setViewDate(new Date(value + 'T12:00:00'))
  }, [value])

  useEffect(() => {
    if (!open) return
    function handleClick(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [open])

  const year = viewDate.getFullYear()
  const month = viewDate.getMonth()
  const days = getDaysInMonth(year, month)
  const startPad = getStartPadding(year, month)

  function handleSelect(d: Date) {
    const str = toYYYYMMDD(d)
    if (str > maxDate) return
    onChange(str)
    setOpen(false)
  }

  function prevMonth() {
    setViewDate(new Date(year, month - 1, 1))
  }

  function nextMonth() {
    const next = new Date(year, month + 1, 1)
    const today = new Date()
    if (next > today) return
    setViewDate(next)
  }

  const displayValue = value ? new Date(value + 'T12:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : ''

  return (
    <div ref={containerRef} className={`birthday-picker ${className}`.trim()}>
      <button
        type="button"
        id={id}
        onClick={() => setOpen(!open)}
        className="birthday-picker__trigger input"
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-label={value ? `Birthday: ${displayValue}` : 'Choose birthday'}
      >
        <span className={value ? '' : 'birthday-picker__placeholder'}>{displayValue || placeholder}</span>
        <span className="birthday-picker__chevron" aria-hidden>▼</span>
      </button>

      {open && (
        <div className="birthday-picker__dropdown" role="dialog" aria-label="Birthday calendar">
          <div className="birthday-picker__nav">
            <button type="button" onClick={prevMonth} className="birthday-picker__nav-btn" aria-label="Previous month">‹</button>
            <span className="birthday-picker__month-year">{MONTHS[month]} {year}</span>
            <button
              type="button"
              onClick={nextMonth}
              className="birthday-picker__nav-btn"
              aria-label="Next month"
              disabled={year >= new Date().getFullYear() && month >= new Date().getMonth()}
            >
              ›
            </button>
          </div>

          <div className="birthday-picker__weekdays">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <span key={day} className="birthday-picker__weekday">{day}</span>
            ))}
          </div>

          <div className="birthday-picker__grid">
            {Array.from({ length: startPad }, (_, i) => (
              <span key={`pad-${i}`} className="birthday-picker__cell birthday-picker__cell--pad" />
            ))}
            {days.map(d => {
              const str = toYYYYMMDD(d)
              const isFuture = str > maxDate
              const isSelected = value === str
              return (
                <button
                  key={str}
                  type="button"
                  disabled={isFuture}
                  onClick={() => handleSelect(d)}
                  className={`birthday-picker__cell birthday-picker__cell--day ${isSelected ? 'birthday-picker__cell--selected' : ''} ${isFuture ? 'birthday-picker__cell--disabled' : ''}`}
                >
                  {d.getDate()}
                </button>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
