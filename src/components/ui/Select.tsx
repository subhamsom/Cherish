'use client'

import { useState, useRef, useEffect } from 'react'
import { ChevronDown } from 'lucide-react'

export interface SelectOption {
  value: string
  label: string
}

interface SelectProps {
  options: SelectOption[]
  value: string
  onChange: (value: string) => void
  placeholder?: string
  disabled?: boolean
  id?: string
  required?: boolean
  width?: string | number
}

const triggerStyle = {
  width: '100%' as const,
  background: '#F9F8FF',
  border: '1px solid #E5E1FF',
  borderRadius: '8px',
  padding: '10px 14px',
  paddingRight: '36px',
  fontFamily: 'Inter, sans-serif',
  fontSize: '14px',
  color: '#1F1F1F',
  outline: 'none',
  cursor: 'pointer' as const,
  textAlign: 'left' as const,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
}

export default function Select({
  options,
  value,
  onChange,
  placeholder = 'Select…',
  disabled = false,
  id,
  required,
  width,
}: SelectProps) {
  const [open, setOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const selectedOption = options.find((o) => o.value === value)
  const displayLabel = selectedOption ? selectedOption.label : placeholder

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

  const resolvedWidth =
    typeof width === 'number' ? `${width}px` : width || '100%'

  return (
    <div ref={containerRef} style={{ position: 'relative', width: resolvedWidth }}>
      <button
        type="button"
        id={id}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-required={required}
        disabled={disabled}
        onClick={() => !disabled && setOpen((o) => !o)}
        style={{
          ...triggerStyle,
          width: resolvedWidth,
          opacity: disabled ? 0.6 : 1,
          cursor: disabled ? 'not-allowed' : 'pointer',
          borderColor: open ? '#7C3AED' : '#E5E1FF',
          boxShadow: open ? '0 0 0 3px rgba(124, 58, 237, 0.1)' : undefined,
        }}
      >
        <span style={{ color: value ? '#1F1F1F' : '#747a84' }}>{displayLabel}</span>
        <ChevronDown
          size={16}
          style={{
            color: '#7C3AED',
            flexShrink: 0,
            marginLeft: '0.5rem',
            transform: open ? 'rotate(180deg)' : 'none',
            transition: 'transform 0.2s ease',
          }}
        />
      </button>

      {open && (
        <div
          role="listbox"
          aria-activedescendant={value ? `option-${value}` : undefined}
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            marginTop: '4px',
            background: '#FFFFFF',
            border: '1px solid #E5E1FF',
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
            zIndex: 50,
            maxHeight: '240px',
            overflowY: 'auto',
          }}
        >
          {options.map((opt) => {
            const isSelected = opt.value === value
            return (
              <button
                key={opt.value}
                type="button"
                role="option"
                id={`option-${opt.value}`}
                aria-selected={isSelected}
                onClick={() => {
                  onChange(opt.value)
                  setOpen(false)
                }}
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '14px',
                  color: '#1F1F1F',
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  textAlign: 'left',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#F9F8FF'
                  e.currentTarget.style.color = '#7C3AED'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'transparent'
                  e.currentTarget.style.color = '#1F1F1F'
                }}
              >
                {opt.label}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
