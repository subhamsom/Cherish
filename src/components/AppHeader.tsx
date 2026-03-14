'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Bell } from 'lucide-react'

const PAGE_TITLES: Record<string, string> = {
  '/dashboard': 'Home',
  '/people': 'People',
  '/reminders': 'Reminders',
  '/entries/new': 'New moment',
}

export default function AppHeader() {
  const pathname = usePathname()
  const title = PAGE_TITLES[pathname] ?? 'Cherish'
  const [unreadCount, setUnreadCount] = useState(0)

  useEffect(() => {
    const supabase = createClient()
    async function fetchUnread() {
      const now = new Date().toISOString()
      const { count } = await supabase
        .from('reminders')
        .select('*', { count: 'exact', head: true })
        .eq('is_sent', false)
        .lte('remind_at', now)
      setUnreadCount(count ?? 0)
    }
    fetchUnread()
  }, [pathname])

  const hasUnread = unreadCount > 0

  return (
    <header
      className="app-header"
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 20,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '20px 32px',
        marginBottom: '0.5rem',
      }}
    >
      <h1
        style={{
          fontFamily: 'var(--font-heading), serif',
          fontSize: '24px',
          fontWeight: 600,
          color: '#2D1B69',
          margin: 0,
        }}
      >
        {title}
      </h1>
      <Link href="/reminders" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
        <button
          type="button"
          aria-label={hasUnread ? 'Notifications (unread)' : 'Notifications'}
          style={{
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '36px',
            height: '36px',
            border: 'none',
            background: 'transparent',
            color: '#747a84',
            cursor: 'pointer',
            borderRadius: '8px',
          }}
        >
          <Bell size={20} strokeWidth={2} />
          {hasUnread && (
            <span
              aria-hidden
              style={{
                position: 'absolute',
                top: '6px',
                right: '6px',
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                background: '#7C3AED',
              }}
            />
          )}
        </button>
      </Link>
    </header>
  )
}
