'use client'

import { Bell } from 'lucide-react'

export default function AppHeader() {
  return (
    <header
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        paddingBottom: '0.75rem',
        marginBottom: '0.5rem',
        minHeight: '32px',
      }}
    >
      <button
        type="button"
        aria-label="Notifications"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '32px',
          height: '32px',
          border: 'none',
          background: 'transparent',
          color: 'var(--charcoal-muted)',
          cursor: 'pointer',
          borderRadius: '8px',
        }}
      >
        <Bell size={20} strokeWidth={2} />
      </button>
    </header>
  )
}
