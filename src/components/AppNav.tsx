'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Home, Users, CalendarClock, ChevronDown, Settings, LogOut } from 'lucide-react'
import EntryModal from '@/components/entries/EntryModal'
import PersonModal from '@/components/people/PersonModal'

const navLinks = [
  { href: '/dashboard', label: 'Home', icon: 'home' as const },
  { href: '/people', label: 'People', icon: 'people' as const },
  { href: '/reminders', label: 'Reminders', icon: 'reminders' as const },
  { href: '/entries/new', label: 'New Moment', icon: '+', primary: true },
]

export default function AppNav() {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()
  const [user, setUser] = useState<{ avatar_url?: string; firstName: string; fullName?: string; email?: string } | null>(null)
  const [profileOpen, setProfileOpen] = useState(false)
  const [fabOpen, setFabOpen] = useState(false)
  const [isEntryModalOpen, setIsEntryModalOpen] = useState(false)
  const [isPersonModalOpen, setIsPersonModalOpen] = useState(false)
  const profileRef = useRef<HTMLDivElement>(null)
  const mobileProfileRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        const meta = session.user.user_metadata
        const avatarUrl = meta?.avatar_url || meta?.picture
        const fullName = meta?.name || meta?.full_name || ''
        setUser({
          avatar_url: avatarUrl,
          firstName: fullName.split(' ')[0] || 'Account',
          fullName: fullName || undefined,
          email: session.user.email || undefined,
        })
      }
    })
  }, [])

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      const target = e.target as Node
      if (profileRef.current?.contains(target) || mobileProfileRef.current?.contains(target)) return
      setProfileOpen(false)
    }
    document.addEventListener('click', handleClickOutside)
    return () => document.removeEventListener('click', handleClickOutside)
  }, [])

  async function handleSignOut() {
    setProfileOpen(false)
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  return (
    <>
      {/* Desktop sidebar — fixed, does not scroll */}
      <nav
        className="desktop-nav bg-white/60 backdrop-blur-md border-r border-[rgba(229,225,255,0.5)]"
        style={{
          width: '250px',
          minHeight: '100vh',
          height: '100vh',
          padding: '2.25rem 1.75rem 2rem',
          display: 'flex',
          flexDirection: 'column',
          position: 'fixed',
          top: 0,
          left: 0,
          zIndex: 10,
        }}
      >
        <Link href="/dashboard" style={{ textDecoration: 'none' }}>
          <div style={{ marginBottom: '2.75rem' }}>
            <span
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: '40px',
                fontWeight: 600,
                color: '#7C3AED',
              }}
            >
              Cherish
            </span>
          </div>
        </Link>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', flex: 1 }}>
          {navLinks.map((link) => {
            const isActive = pathname === link.href
            const isPrimary = link.primary
            const content = (
                <div
                  className={isPrimary ? undefined : `nav-link ${isActive ? 'nav-link--active' : ''}`}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: isPrimary ? '0.7rem 1rem' : '0.55rem 0.85rem',
                    borderRadius: isPrimary ? 999 : 0,
                    borderTopLeftRadius: isPrimary ? 999 : 6,
                    borderBottomLeftRadius: isPrimary ? 999 : 6,
                    fontSize: isPrimary ? '0.78rem' : '0.86rem',
                    letterSpacing: isPrimary ? '0.12em' : '0.02em',
                    textTransform: isPrimary ? 'uppercase' : 'none',
                    ...(isPrimary
                      ? {
                          background: 'var(--accent)',
                          color: '#FFFFFF',
                          border: 'none',
                          boxShadow: '0 4px 12px rgba(124, 58, 237, 0.3)',
                          fontWeight: 500,
                        }
                      : {
                          border: '1px solid transparent',
                          borderLeft: '3px solid transparent',
                          borderTopRightRadius: 6,
                          borderBottomRightRadius: 6,
                          transition: 'all 0.16s ease',
                        }),
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem' }}>
                    {link.icon && link.icon !== '+' && (
                      <span aria-hidden style={{ display: 'flex', opacity: isPrimary || isActive ? 1 : 0.7 }}>
                        {link.icon === 'home' && <Home size={18} strokeWidth={2} />}
                        {link.icon === 'people' && <Users size={18} strokeWidth={2} />}
                        {link.icon === 'reminders' && <CalendarClock size={18} strokeWidth={2} />}
                      </span>
                    )}
                    {link.icon === '+' && isPrimary && (
                      <span aria-hidden style={{ fontSize: '0.9rem', opacity: 1 }}>+</span>
                    )}
                    <span>{link.label}</span>
                  </div>
                  {!isPrimary && isActive && (
                    <span
                      aria-hidden
                      style={{
                        width: '6px',
                        height: '6px',
                        borderRadius: '999px',
                        background: 'var(--accent)',
                      }}
                    />
                  )}
                </div>
            )
            return isPrimary ? (
              <button
                key={link.href}
                type="button"
                onClick={() => setIsEntryModalOpen(true)}
                style={{ textDecoration: 'none', background: 'none', border: 'none', padding: 0, cursor: 'pointer', font: 'inherit', color: 'inherit', width: '100%', textAlign: 'left' }}
              >
                {content}
              </button>
            ) : (
              <Link key={link.href} href={link.href} style={{ textDecoration: 'none' }}>
                {content}
              </Link>
            )
          })}
        </div>

        <div ref={profileRef} style={{ marginTop: 'auto', position: 'relative' }}>
          <button
            type="button"
            onClick={() => setProfileOpen((o) => !o)}
            aria-expanded={profileOpen}
            aria-haspopup="true"
            style={{
              width: '100%',
              background: 'transparent',
              border: 'none',
              padding: '0.5rem 0',
              display: 'flex',
              alignItems: 'center',
              gap: '0.6rem',
              cursor: 'pointer',
              borderRadius: '8px',
            }}
          >
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: '50%',
                flexShrink: 0,
                overflow: 'hidden',
                border: '1px solid rgba(124, 58, 237, 0.2)',
                boxSizing: 'border-box',
                background: user?.avatar_url ? 'transparent' : '#EDE9FE',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: user?.avatar_url ? undefined : '#7C3AED',
                fontFamily: 'Inter, sans-serif',
                fontWeight: 600,
                fontSize: '0.8rem',
              }}
            >
              {user?.avatar_url ? (
                <img src={user.avatar_url} alt="" width={32} height={32} style={{ objectFit: 'cover' }} />
              ) : (
                (user?.fullName?.[0] ?? user?.email?.[0] ?? user?.firstName?.[0] ?? '?').toUpperCase()
              )}
            </div>
            <span style={{ fontSize: '0.85rem', fontWeight: 500, color: 'var(--text-primary)', flex: 1, textAlign: 'left' }}>
              {user?.firstName ?? '…'}
            </span>
            <ChevronDown size={16} style={{ color: '#747a84', flexShrink: 0 }} />
          </button>
          {profileOpen && (
            <div
              role="menu"
              style={{
                position: 'absolute',
                bottom: '100%',
                left: 0,
                right: 0,
                marginBottom: '0.35rem',
                background: '#FFFFFF',
                border: '1px solid #E5E1FF',
                borderRadius: '12px',
                boxShadow: '0 8px 24px rgba(124, 58, 237, 0.12)',
                overflow: 'hidden',
                padding: '0.75rem 0',
                minWidth: '200px',
              }}
            >
              <div style={{ padding: '0 1rem 0.6rem' }}>
                <p
                  style={{
                    fontFamily: "'DM Sans', var(--font-body), sans-serif",
                    fontSize: '14px',
                    fontWeight: 600,
                    color: '#2D1B69',
                    margin: 0,
                  }}
                >
                  {user?.fullName || user?.firstName || 'Account'}
                </p>
                {user?.email && (
                  <p
                    style={{
                      fontFamily: "'DM Sans', var(--font-body), sans-serif",
                      fontSize: '12px',
                      color: '#747a84',
                      margin: '0.2rem 0 0 0',
                    }}
                  >
                    {user.email}
                  </p>
                )}
              </div>
              <div style={{ height: 1, background: '#E5E1FF', margin: '0 0 0.25rem 0' }} />
              <Link
                href="/settings"
                onClick={() => setProfileOpen(false)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.5rem 1rem',
                  fontSize: '0.875rem',
                  color: 'var(--text-primary)',
                  textDecoration: 'none',
                  fontFamily: "'DM Sans', var(--font-body), sans-serif",
                }}
              >
                <Settings size={16} strokeWidth={2} style={{ color: '#6B7280' }} />
                Settings
              </Link>
              <button
                type="button"
                onClick={handleSignOut}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.5rem 1rem',
                  fontSize: '0.875rem',
                  color: '#DC2626',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  textAlign: 'left',
                  fontFamily: "'DM Sans', var(--font-body), sans-serif",
                }}
              >
                <LogOut size={16} strokeWidth={2} />
                Sign out
              </button>
            </div>
          )}
        </div>
      </nav>

      {/* Mobile top bar + floating action */}
      <nav
        className="mobile-nav bg-white/60 backdrop-blur-md border-b border-[rgba(229,225,255,0.4)]"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          padding: '0.75rem 1rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          zIndex: 100,
        }}
      >
        <Link href="/dashboard" style={{ textDecoration: 'none' }}>
          <div>
            <p
              style={{
                fontSize: '0.6rem',
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                color: 'var(--charcoal-muted)',
                marginBottom: '0.1rem',
              }}
            >
              Cherish
            </p>
            <p
              className="serif"
              style={{ fontSize: '1.375rem', fontWeight: 600, color: 'var(--charcoal)' }}
            >
              Your people
            </p>
          </div>
        </Link>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          {navLinks
            .filter((link) => !link.primary)
            .map((link) => {
              const isActive = pathname === link.href
              return (
                <Link key={link.href} href={link.href} style={{ textDecoration: 'none' }}>
                  <button
                    type="button"
                    style={{
                      padding: '0.4rem 0.7rem',
                      borderRadius: 999,
                      border: 'none',
                      fontSize: '0.7rem',
                      letterSpacing: '0.12em',
                      textTransform: 'uppercase',
                      backgroundColor: isActive
                        ? 'var(--bg-secondary)'
                        : 'transparent',
                      color: isActive ? 'var(--accent)' : 'var(--text-secondary)',
                      cursor: 'pointer',
                    }}
                  >
                    {link.label}
                  </button>
                </Link>
              )
            })}
          <div ref={mobileProfileRef} style={{ position: 'relative', marginLeft: '0.25rem' }}>
            <button
              type="button"
              onClick={() => setProfileOpen((o) => !o)}
              aria-expanded={profileOpen}
              aria-haspopup="true"
              style={{
                padding: '0.35rem',
                background: 'transparent',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
              }}
            >
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: '50%',
                  overflow: 'hidden',
                  border: '1px solid rgba(124, 58, 237, 0.2)',
                  boxSizing: 'border-box',
                  background: user?.avatar_url ? 'transparent' : '#EDE9FE',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: user?.avatar_url ? undefined : '#7C3AED',
                  fontFamily: 'Inter, sans-serif',
                  fontWeight: 600,
                  fontSize: '0.8rem',
                }}
              >
                {user?.avatar_url ? (
                  <img src={user.avatar_url} alt="" width={32} height={32} style={{ objectFit: 'cover' }} />
                ) : (
                  (user?.fullName?.[0] ?? user?.email?.[0] ?? user?.firstName?.[0] ?? '?').toUpperCase()
                )}
              </div>
              <ChevronDown size={16} style={{ color: '#747a84', flexShrink: 0 }} />
            </button>
            {profileOpen && (
              <div
                role="menu"
                style={{
                  position: 'absolute',
                  bottom: '100%',
                  right: 0,
                  marginBottom: '0.35rem',
                  background: '#FFFFFF',
                  border: '1px solid #E5E1FF',
                  borderRadius: '12px',
                  boxShadow: '0 8px 24px rgba(124, 58, 237, 0.12)',
                  overflow: 'hidden',
                  padding: '0.75rem 0',
                  minWidth: '220px',
                  zIndex: 200,
                }}
              >
                <div style={{ padding: '0 1rem 0.6rem' }}>
                  <p
                    style={{
                      fontFamily: "'DM Sans', var(--font-body), sans-serif",
                      fontSize: '14px',
                      fontWeight: 600,
                      color: '#2D1B69',
                      margin: 0,
                    }}
                  >
                    {user?.fullName || user?.firstName || 'Account'}
                  </p>
                  {user?.email && (
                    <p
                      style={{
                        fontFamily: "'DM Sans', var(--font-body), sans-serif",
                        fontSize: '12px',
                        color: '#747a84',
                        margin: '0.2rem 0 0 0',
                      }}
                    >
                      {user.email}
                    </p>
                  )}
                </div>
                <div style={{ height: 1, background: '#E5E1FF', margin: '0 0 0.25rem 0' }} />
                <Link
                  href="/settings"
                  onClick={() => setProfileOpen(false)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.5rem 1rem',
                    fontSize: '0.875rem',
                    color: 'var(--text-primary)',
                    textDecoration: 'none',
                    fontFamily: "'DM Sans', var(--font-body), sans-serif",
                  }}
                >
                  <Settings size={16} strokeWidth={2} style={{ color: '#6B7280' }} />
                  Settings
                </Link>
                <button
                  type="button"
                  onClick={handleSignOut}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.5rem 1rem',
                    fontSize: '0.875rem',
                    color: '#DC2626',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    textAlign: 'left',
                    fontFamily: "'DM Sans', var(--font-body), sans-serif",
                  }}
                >
                  <LogOut size={16} strokeWidth={2} />
                  Sign out
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Mobile floating action button — expandable */}
      <div className="mobile-fab-wrapper" style={{ position: 'fixed', right: '1.25rem', bottom: '1.6rem', zIndex: 90 }}>
        {fabOpen && (
          <div
            style={{
              position: 'absolute',
              bottom: '100%',
              right: 0,
              marginBottom: '0.5rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.4rem',
              alignItems: 'flex-end',
            }}
          >
            <button
              type="button"
              onClick={() => { setFabOpen(false); setIsEntryModalOpen(true) }}
              style={{
                padding: '0.5rem 1rem',
                borderRadius: 999,
                border: '1px solid var(--card-border)',
                background: '#FFFFFF',
                color: 'var(--accent)',
                fontSize: '0.8rem',
                fontWeight: 500,
                boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                whiteSpace: 'nowrap',
                cursor: 'pointer',
              }}
            >
              ✨ New Moment
            </button>
            <button
              type="button"
              onClick={() => { setFabOpen(false); setIsPersonModalOpen(true) }}
              style={{
                padding: '0.5rem 1rem',
                borderRadius: 999,
                border: '1px solid var(--card-border)',
                background: '#FFFFFF',
                color: 'var(--accent)',
                fontSize: '0.8rem',
                fontWeight: 500,
                boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                whiteSpace: 'nowrap',
                cursor: 'pointer',
              }}
            >
              👤 Add Person
            </button>
          </div>
        )}
        <button
          type="button"
          onClick={() => setFabOpen((o) => !o)}
          style={{
            width: '56px',
            height: '56px',
            borderRadius: '50%',
            border: 'none',
            background: 'var(--accent)',
            color: '#FFFFFF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 14px rgba(124, 58, 237, 0.4)',
            fontSize: '1.5rem',
            fontWeight: 300,
            cursor: 'pointer',
          }}
        >
          +
        </button>
      </div>

      <EntryModal
        isOpen={isEntryModalOpen}
        onClose={() => setIsEntryModalOpen(false)}
        onAddPersonClick={() => { setIsEntryModalOpen(false); setIsPersonModalOpen(true) }}
      />
      <PersonModal isOpen={isPersonModalOpen} onClose={() => setIsPersonModalOpen(false)} />

      <style>{`
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
        }
        @media (min-width: 769px) {
          .mobile-nav { display: none !important; }
          .mobile-fab-wrapper { display: none !important; }
        }
      `}</style>
    </>
  )
}
