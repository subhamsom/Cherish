'use client'

import { usePathname } from 'next/navigation'
import { Bell } from 'lucide-react'

const PAGE_TITLES: Record<string, string> = {
  '/dashboard': 'Home',
  '/people': 'People',
  '/entries/new': 'New moment',
}

export default function AppHeader() {
  const pathname = usePathname()
  const title = PAGE_TITLES[pathname] ?? 'Cherish'

  return (
    <header
      className="app-header"
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0.75rem 0 1rem',
        marginBottom: '0.5rem',
        borderBottom: '1px solid var(--card-border)',
        minHeight: '48px',
      }}
    >
      <h1
        className="serif"
        style={{
          fontSize: '1.25rem',
          fontWeight: 600,
          color: 'var(--text-primary)',
          margin: 0,
        }}
      >
        {title}
      </h1>
      <button
        type="button"
        aria-label="Notifications"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '36px',
          height: '36px',
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
