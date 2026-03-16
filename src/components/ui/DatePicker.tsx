'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { CalendarIcon, ChevronLeft, ChevronRight, ChevronDown } from 'lucide-react'
import { DayPicker, type NavProps } from 'react-day-picker'
import 'react-day-picker/style.css'

type DropdownOption = { value: number; label: string; disabled: boolean }

const dropdownTriggerStyle: React.CSSProperties = {
  background: '#F9F8FF',
  border: '1px solid #E5E1FF',
  borderRadius: '8px',
  padding: '6px 10px',
  fontFamily: 'var(--font-body), sans-serif',
  fontSize: '13px',
  color: '#7C3AED',
  cursor: 'pointer',
  outline: 'none',
  display: 'flex',
  alignItems: 'center',
  gap: '4px',
}

const dropdownPanelStyle: React.CSSProperties = {
  position: 'absolute',
  top: '100%',
  left: 0,
  marginTop: '4px',
  background: '#FFFFFF',
  border: '1px solid #E5E1FF',
  borderRadius: '8px',
  boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
  zIndex: 60,
  minWidth: '80px',
  maxHeight: '200px',
  overflowY: 'auto',
}

/** Custom dropdown (month or year) with constrained height, consistent styling */
function CustomDropdown(props: {
  options?: DropdownOption[]
  value?: number
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void
  disabled?: boolean
  reverseOrder?: boolean
}) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const { options = [], value, onChange, disabled, reverseOrder = false } = props
  const selectedOption = options.find((o) => o.value === value)
  const orderedOptions = reverseOrder ? [...options].reverse() : options

  useEffect(() => {
    if (!open) return
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [open])

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <button
        type="button"
        disabled={disabled}
        onClick={() => !disabled && setOpen((o) => !o)}
        style={{
          ...dropdownTriggerStyle,
          cursor: disabled ? 'default' : 'pointer',
        }}
      >
        {selectedOption?.label ?? value}
        <ChevronDown size={16} strokeWidth={2} />
      </button>
      {open && (
        <div style={dropdownPanelStyle}>
          {orderedOptions
            .filter((o) => !o.disabled)
            .map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => {
                  onChange({ target: { value: String(opt.value) } } as React.ChangeEvent<HTMLSelectElement>)
                  setOpen(false)
                }}
                style={{
                  display: 'block',
                  width: '100%',
                  padding: '8px 12px',
                  border: 'none',
                  background: opt.value === value ? 'rgba(124, 58, 237, 0.12)' : 'transparent',
                  color: opt.value === value ? '#7C3AED' : '#1F1F1F',
                  fontFamily: 'var(--font-body), sans-serif',
                  fontSize: '13px',
                  cursor: 'pointer',
                  textAlign: 'left',
                }}
                onMouseEnter={(e) => {
                  if (opt.value !== value) e.currentTarget.style.backgroundColor = 'rgba(124, 58, 237, 0.06)'
                }}
                onMouseLeave={(e) => {
                  if (opt.value !== value) e.currentTarget.style.backgroundColor = 'transparent'
                }}
              >
                {opt.label}
              </button>
            ))}
        </div>
      )}
    </div>
  )
}

/** Year dropdown with newest-first order */
function CustomYearsDropdown(
  props: React.ComponentProps<typeof CustomDropdown>
) {
  return <CustomDropdown {...props} reverseOrder />
}

interface DatePickerProps {
  value: Date | null
  onChange: (date: Date) => void
  minDate?: Date
  maxDate?: Date
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
  maxDate,
  placeholder = 'Select date…',
}: DatePickerProps) {
  const [open, setOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const touchStartX = useRef<number | null>(null)

  const now = new Date()
  const currentYear = now.getFullYear()
  const startOfTomorrow = maxDate ? new Date(maxDate.getFullYear(), maxDate.getMonth(), maxDate.getDate() + 1) : undefined
  const startMonthDate = maxDate ? new Date(currentYear - 100, 0, 1) : new Date(currentYear, 0, 1)
  const endMonthDate = maxDate ? new Date(maxDate.getFullYear(), maxDate.getMonth(), 1) : new Date(currentYear + 5, 11, 1)
  const [displayMonth, setDisplayMonth] = useState<Date>(() => {
    if (value) return new Date(value.getFullYear(), value.getMonth(), 1)
    if (minDate && minDate > now) return new Date(minDate.getFullYear(), minDate.getMonth(), 1)
    if (maxDate) return new Date(maxDate.getFullYear(), maxDate.getMonth(), 1)
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
      else if (maxDate) setDisplayMonth(new Date(maxDate.getFullYear(), maxDate.getMonth(), 1))
      else setDisplayMonth(new Date(now.getFullYear(), now.getMonth(), 1))
    }
  }, [open, value, minDate, maxDate])

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
          fontFamily: 'var(--font-body), sans-serif',
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
            minWidth: '280px',
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
            if (next < startMonthDate || next > endMonthDate) return
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
            disabled={
              minDate || startOfTomorrow
                ? { ...(minDate && { before: minDate }), ...(startOfTomorrow && { after: startOfTomorrow }) }
                : undefined
            }
            captionLayout="dropdown"
            navLayout="around"
            components={{
              MonthsDropdown: CustomDropdown,
              YearsDropdown: CustomYearsDropdown,
              Nav: (navProps: NavProps) => {
                const { previousMonth, nextMonth, onPreviousClick, onNextClick } = navProps
                return (
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginBottom: '0.5rem',
                      minHeight: '2.75rem',
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
            startMonth={startMonthDate}
            endMonth={endMonthDate}
          />
        </div>
      )}
    </div>
  )
}
