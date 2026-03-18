'use client'

import { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import { usePathname } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Bell } from 'lucide-react'
import { RELATIONSHIP_COLORS } from '@/lib/reminders'
import { formatReminderDueLabel } from '@/lib/reminders'
import type { ReminderWithDetails } from '@/types'

const PAGE_TITLES: Record<string, string> = {
  '/dashboard': 'Home',
  '/people': 'People',
  '/reminders': 'Reminders',
  '/entries/new': 'New moment',
}

const nowIso = () => new Date().toISOString()

async function fetchPendingCount(supabase: ReturnType<typeof createClient>) {
  const { count } = await supabase
    .from('reminders')
    .select('*', { count: 'exact', head: true })
    .eq('is_sent', false)
    .lte('remind_at', nowIso())
  return count ?? 0
}

async function fetchPendingList(supabase: ReturnType<typeof createClient>) {
  const { data, error } = await supabase
    .from('reminders')
    .select('*, people(name, relationship_type)')
    .eq('is_sent', false)
    .lte('remind_at', nowIso())
    .order('remind_at', { ascending: true })
  if (error) return []
  return (data ?? []) as ReminderWithDetails[]
}

export default function AppHeader() {
  const pathname = usePathname()
  const title = PAGE_TITLES[pathname] ?? 'Cherish'
  const [unreadCount, setUnreadCount] = useState(0)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [listItems, setListItems] = useState<ReminderWithDetails[]>([])
  const [loadingList, setLoadingList] = useState(false)
  const [actioningIds, setActioningIds] = useState<Set<string>>(new Set())
  const dropdownRef = useRef<HTMLDivElement>(null)

  const supabase = useMemo(() => createClient(), [])

  const refreshCount = useCallback(() => {
    fetchPendingCount(supabase).then(setUnreadCount)
  }, [supabase])

  const refreshList = useCallback(() => {
    fetchPendingList(supabase).then(setListItems)
  }, [supabase])

  // Initial + every 60s count refresh
  useEffect(() => {
    refreshCount()
    const interval = setInterval(refreshCount, 60_000)
    return () => clearInterval(interval)
  }, [refreshCount])

  // Real-time: reminders table changes
  useEffect(() => {
    const channel = supabase
      .channel('reminders-header')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'reminders' },
        () => {
          refreshCount()
          if (dropdownOpen) refreshList()
        }
      )
      .subscribe()
    return () => {
      supabase.removeChannel(channel)
    }
  }, [dropdownOpen, refreshCount, refreshList])

  // Fetch list when dropdown opens
  useEffect(() => {
    if (!dropdownOpen) return
    setLoadingList(true)
    fetchPendingList(supabase).then((items) => {
      setListItems(items)
      setLoadingList(false)
    })
  }, [dropdownOpen, supabase])

  // Outside click to close
  useEffect(() => {
    if (!dropdownOpen) return
    function handleClick(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [dropdownOpen])

  const hasUnread = unreadCount > 0
  const badgeLabel = unreadCount > 9 ? '9+' : String(unreadCount)

  async function handleMarkDone(id: string) {
    setActioningIds((prev) => new Set(prev).add(id))
    await supabase.from('reminders').update({ is_sent: true }).eq('id', id)
    refreshCount()
    refreshList()
    setActioningIds((prev) => {
      const next = new Set(prev)
      next.delete(id)
      return next
    })
  }

  async function handleMarkAllDone() {
    const ids = listItems.map((r) => r.id)
    if (ids.length === 0) return
    setActioningIds(new Set(ids))
    await supabase.from('reminders').update({ is_sent: true }).in('id', ids)
    refreshCount()
    refreshList()
    setActioningIds(new Set())
  }

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

      <div ref={dropdownRef} style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
        <button
          type="button"
          aria-label={hasUnread ? 'Notifications (unread)' : 'Notifications'}
          aria-expanded={dropdownOpen}
          aria-haspopup="true"
          onClick={() => setDropdownOpen((o) => !o)}
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
                top: '-2px',
                right: '-2px',
                minWidth: '16px',
                height: '16px',
                padding: '0 4px',
                boxSizing: 'border-box',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '50%',
                background: '#7C3AED',
                color: '#fff',
                fontFamily: 'var(--font-sans), DM Sans, sans-serif',
                fontSize: '11px',
                fontWeight: 700,
              }}
            >
              {badgeLabel}
            </span>
          )}
        </button>

        {dropdownOpen && (
          <div
            className="reminder-dropdown-panel"
            role="dialog"
            aria-label="Reminders"
            style={{
              position: 'absolute',
              top: '100%',
              right: 0,
              marginTop: '8px',
              width: '320px',
              maxWidth: 'min(320px, calc(100vw - 24px))',
              maxHeight: '400px',
              background: '#fff',
              border: '1px solid #E5E1FF',
              borderRadius: '16px',
              boxShadow: '0 10px 40px rgba(45, 27, 105, 0.12)',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
              zIndex: 30,
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '14px 16px',
                borderBottom: '1px solid #E5E1FF',
                flexShrink: 0,
              }}
            >
              <span
                style={{
                  fontFamily: 'var(--font-heading), Fraunces, serif',
                  fontSize: '18px',
                  fontWeight: 600,
                  color: '#2D1B69',
                }}
              >
                Reminders
              </span>
              {listItems.length > 0 && (
                <button
                  type="button"
                  onClick={handleMarkAllDone}
                  disabled={actioningIds.size > 0}
                  style={{
                    fontFamily: 'var(--font-sans), DM Sans, sans-serif',
                    fontSize: '13px',
                    fontWeight: 600,
                    color: '#7C3AED',
                    background: 'transparent',
                    border: 'none',
                    cursor: actioningIds.size > 0 ? 'default' : 'pointer',
                    opacity: actioningIds.size > 0 ? 0.6 : 1,
                  }}
                >
                  Mark all done
                </button>
              )}
            </div>

            <div
              style={{
                overflowY: 'auto',
                maxHeight: '340px',
                padding: '8px 0',
              }}
            >
              {loadingList ? (
                <p style={{ padding: '24px 16px', fontSize: '14px', color: '#747a84', margin: 0, textAlign: 'center' }}>
                  Loading…
                </p>
              ) : listItems.length === 0 ? (
                <p
                  style={{
                    padding: '32px 16px',
                    fontSize: '14px',
                    color: '#747a84',
                    margin: 0,
                    textAlign: 'center',
                  }}
                >
                  You&apos;re all caught up 💜
                </p>
              ) : (
                listItems.map((r) => {
                  const relType = r.people?.relationship_type ?? 'other'
                  const dotColor = RELATIONSHIP_COLORS[relType] ?? RELATIONSHIP_COLORS.other
                  const busy = actioningIds.has(r.id)
                  return (
                    <div
                      key={r.id}
                      style={{
                        padding: '12px 16px',
                        borderBottom: '1px solid #f0eeff',
                      }}
                    >
                      <div style={{ fontFamily: 'var(--font-sans), DM Sans, sans-serif', fontSize: '14px', color: '#2D1B69', fontWeight: 500, marginBottom: '4px' }}>
                        {r.title}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
                        <span
                          style={{
                            width: '6px',
                            height: '6px',
                            borderRadius: '50%',
                            background: dotColor,
                            flexShrink: 0,
                          }}
                        />
                        <span style={{ fontFamily: 'var(--font-sans), DM Sans, sans-serif', fontSize: '13px', color: '#2D1B69' }}>
                          {r.people?.name ?? 'Someone'}
                        </span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
                        <span style={{ fontFamily: 'var(--font-sans), DM Sans, sans-serif', fontSize: '12px', color: '#747a84' }}>
                          {formatReminderDueLabel(r.remind_at)}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleMarkDone(r.id)}
                          disabled={busy}
                          style={{
                            fontFamily: 'var(--font-sans), DM Sans, sans-serif',
                            fontSize: '12px',
                            fontWeight: 600,
                            color: '#7C3AED',
                            background: 'transparent',
                            border: 'none',
                            cursor: busy ? 'default' : 'pointer',
                            opacity: busy ? 0.6 : 1,
                          }}
                        >
                          {busy ? '…' : 'Mark done'}
                        </button>
                      </div>
                    </div>
                  )
                })
              )}
            </div>
          </div>
        )}

      </div>
    </header>
  )
}
