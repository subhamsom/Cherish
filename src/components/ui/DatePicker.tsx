'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react'
import { DayPicker, type NavProps } from 'react-day-picker'
import 'react-day-picker/style.css'

interface DatePickerProps {
  value: Date | null
  onChange: (date: Date) => void
  minDate?: Date
  placeholder?: string
}

function formatDisplayDate(date: Date): string {
  return date.toLocaleDateString('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

export default function DatePicker({
  value,
  onChange,
  minDate,
  placeholder = 'Select date…',
}: DatePickerProps) {
  const [open, setOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const touchStartX = useRef<number | null>(null)

  const now = new Date()
  const currentYear = now.getFullYear()
  const [displayMonth, setDisplayMonth] = useState<Date>(() => {
    if (value) return new Date(value.getFullYear(), value.getMonth(), 1)
    if (minDate && minDate > now) return new Date(minDate.getFullYear(), minDate.getMonth(), 1)
    return new Date(now.getFullYear(), now.getMonth(), 1)
  })

  const displayText = value ? formatDisplayDate(value) : placeholder

  const handleMonthChange = useCallback((newMonth: Date) => {
    setDisplayMonth(new Date(newMonth.getFullYear(), newMonth.getMonth(), 1))
  }, [])

  useEffect(() => {
    if (open) {
      if (value) setDisplayMonth(new Date(value.getFullYear(), value.getMonth(), 1))
      else if (minDate && minDate > now) setDisplayMonth(new Date(minDate.getFullYear(), minDate.getMonth(), 1))
      else setDisplayMonth(new Date(now.getFullYear(), now.getMonth(), 1))
    }
  }, [open, value, minDate])

  useEffect(() => {
    function handleMouseDownOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    if (open) {
      document.addEventListener('mousedown', handleMouseDownOutside)
      return () => document.removeEventListener('mousedown', handleMouseDownOutside)
    }
  }, [open])

  return (
    <div ref={containerRef} style={{ position: 'relative', width: '100%' }}>
      <button
        type="button"
        aria-haspopup="dialog"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        style={{
          width: '100%',
          background: '#F9F8FF',
          border: '1px solid #E5E1FF',
          borderRadius: '8px',
          padding: '10px 14px',
          paddingRight: '40px',
          fontFamily: 'Inter, sans-serif',
          fontSize: '14px',
          color: value ? '#1F1F1F' : '#747a84',
          outline: 'none',
          cursor: 'pointer',
          textAlign: 'left',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <span>{displayText}</span>
        <CalendarIcon
          size={18}
          style={{
            color: '#7C3AED',
            flexShrink: 0,
            marginLeft: '0.5rem',
          }}
        />
      </button>

      {open && (
        <div
          className="rdp-datepicker-panel"
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            marginTop: '4px',
            background: '#FFFFFF',
            border: '1px solid #E5E1FF',
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
            zIndex: 50,
            padding: '12px',
          }}
          onTouchStart={(e) => {
            touchStartX.current = e.touches[0].clientX
          }}
          onTouchEnd={(e) => {
            if (touchStartX.current == null) return
            const deltaX = e.changedTouches[0].clientX - touchStartX.current
            touchStartX.current = null
            if (Math.abs(deltaX) < 50) return
            const dir = deltaX < 0 ? 1 : -1
            const next = new Date(displayMonth.getFullYear(), displayMonth.getMonth() + dir, 1)
            const min = new Date(currentYear, 0, 1)
            const max = new Date(currentYear + 5, 11, 1)
            if (next < min || next > max) return
            handleMonthChange(next)
          }}
        >
          <DayPicker
            mode="single"
            month={displayMonth}
            onMonthChange={handleMonthChange}
            selected={value ?? undefined}
            onSelect={(date) => {
              if (date) {
                onChange(date)
                setOpen(false)
              }
            }}
            disabled={minDate ? { before: minDate } : undefined}
            captionLayout="dropdown"
            navLayout="around"
            components={{
              Nav: (navProps: NavProps) => {
                const { previousMonth, nextMonth, onPreviousClick, onNextClick } = navProps
                return (
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginBottom: '0.5rem',
                    }}
                  >
                    <button
                      type="button"
                      onClick={onPreviousClick}
                      disabled={!previousMonth}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        padding: 0,
                        cursor: previousMonth ? 'pointer' : 'default',
                        opacity: previousMonth ? 1 : 0.4,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                      aria-label="Previous month"
                    >
                      <ChevronLeft size={24} color="#7C3AED" />
                    </button>
                    {navProps.children}
                    <button
                      type="button"
                      onClick={onNextClick}
                      disabled={!nextMonth}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        padding: 0,
                        cursor: nextMonth ? 'pointer' : 'default',
                        opacity: nextMonth ? 1 : 0.4,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                      aria-label="Next month"
                    >
                      <ChevronRight size={24} color="#7C3AED" />
                    </button>
                  </div>
                )
              },
            }}
            startMonth={new Date(currentYear, 0, 1)}
            endMonth={new Date(currentYear + 5, 11, 1)}
          />
        </div>
      )}
    </div>
  )
}
