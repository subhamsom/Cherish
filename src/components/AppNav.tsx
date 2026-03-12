'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Home, Users, ChevronDown } from 'lucide-react'

const navLinks = [
  { href: '/dashboard', label: 'Home', icon: 'home' as const },
  { href: '/people', label: 'People', icon: 'people' as const },
  { href: '/entries/new', label: '+ New Moment', icon: '+', primary: true },
]

export default function AppNav() {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()
  const [user, setUser] = useState<{ avatar_url?: string; firstName: string } | null>(null)
  const [profileOpen, setProfileOpen] = useState(false)
  const [fabOpen, setFabOpen] = useState(false)
  const profileRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        const meta = session.user.user_metadata
        setUser({
          avatar_url: meta?.avatar_url ?? meta?.picture,
          firstName: meta?.name?.split(' ')[0] || 'Account',
        })
      }
    })
  }, [])

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) setProfileOpen(false)
    }
    document.addEventListener('click', handleClickOutside)
    return () => document.removeEventListener('click', handleClickOutside)
  }, [])

  async function handleSignOut() {
    setProfileOpen(false)
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  return (
    <>
      {/* Desktop sidebar */}
      <nav
        className="desktop-nav"
        style={{
          width: '250px',
          minHeight: '100vh',
          borderRight: '1px solid var(--card-border)',
          padding: '2.25rem 1.75rem 2rem',
          display: 'flex',
          flexDirection: 'column',
          position: 'sticky',
          top: 0,
          background: 'var(--bg-primary)',
        }}
      >
        <Link href="/dashboard" style={{ textDecoration: 'none' }}>
          <div style={{ marginBottom: '2.75rem' }}>
            <p
              style={{
                fontSize: '0.7rem',
                letterSpacing: '0.16em',
                textTransform: 'uppercase',
                color: 'var(--charcoal-muted)',
                marginBottom: '0.45rem',
              }}
            >
              Daily ritual
            </p>
            <h2
              className="serif"
              style={{
                fontSize: '1.7rem',
                fontWeight: 600,
                color: 'var(--terracotta)',
                letterSpacing: '0.06em',
              }}
            >
              Cherish
            </h2>
          </div>
        </Link>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', flex: 1 }}>
          {navLinks.map((link) => {
            const isActive = pathname === link.href
            const isPrimary = link.primary
            return (
              <Link key={link.href} href={link.href} style={{ textDecoration: 'none' }}>
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
                    fontWeight: isPrimary || isActive ? 500 : 300,
                    letterSpacing: isPrimary ? '0.12em' : '0.02em',
                    textTransform: isPrimary ? 'uppercase' : 'none',
                    background: isPrimary
                      ? 'var(--accent)'
                      : undefined,
                    color: isPrimary
                      ? '#FFFFFF'
                      : isActive
                      ? 'var(--text-primary)'
                      : 'var(--text-secondary)',
                    border: isPrimary
                      ? 'none'
                      : '1px solid transparent',
                    borderLeft: !isPrimary ? (isActive ? '3px solid var(--accent)' : '3px solid transparent') : undefined,
                    boxShadow: isPrimary
                      ? '0 4px 12px rgba(124, 58, 237, 0.3)'
                      : undefined,
                    transition: 'all 0.16s ease',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem' }}>
                    {link.icon && link.icon !== '+' && (
                      <span aria-hidden style={{ display: 'flex', opacity: isPrimary || isActive ? 1 : 0.7 }}>
                        {link.icon === 'home' && <Home size={18} strokeWidth={2} />}
                        {link.icon === 'people' && <Users size={18} strokeWidth={2} />}
                      </span>
                    )}
                    {link.icon === '+' && (
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
              </Link>
            )
          })}
        </div>

        <div ref={profileRef} style={{ marginTop: 'auto', position: 'relative' }}>
          <button
            type="button"
            onClick={() => setProfileOpen((o) => !o)}
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
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                flexShrink: 0,
                overflow: 'hidden',
                background: user?.avatar_url ? 'transparent' : '#EDE9FE',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: user?.avatar_url ? undefined : '#7C3AED',
                fontFamily: 'Inter, sans-serif',
                fontWeight: 600,
                fontSize: '0.9rem',
              }}
            >
              {user?.avatar_url ? (
                <img src={user.avatar_url} alt="" width={36} height={36} style={{ objectFit: 'cover' }} />
              ) : (
                (user?.firstName?.[0] ?? '?').toUpperCase()
              )}
            </div>
            <span style={{ fontSize: '0.85rem', fontWeight: 500, color: 'var(--text-primary)', flex: 1, textAlign: 'left' }}>
              {user?.firstName ?? '…'}
            </span>
            <ChevronDown size={14} style={{ color: 'var(--charcoal-muted)', flexShrink: 0 }} />
          </button>
          {profileOpen && (
            <div
              style={{
                position: 'absolute',
                bottom: '100%',
                left: 0,
                right: 0,
                marginBottom: '0.25rem',
                background: 'var(--card-bg)',
                border: '1px solid var(--card-border)',
                borderRadius: '8px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                overflow: 'hidden',
              }}
            >
              <button
                type="button"
                onClick={handleSignOut}
                style={{
                  width: '100%',
                  padding: '0.5rem 0.75rem',
                  fontSize: '0.8rem',
                  color: 'var(--charcoal-soft)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  textAlign: 'left',
                }}
              >
                Sign out
              </button>
            </div>
          )}
        </div>
      </nav>

      {/* Mobile top bar + floating action */}
      <nav
        className="mobile-nav"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          padding: '0.75rem 1rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          backdropFilter: 'blur(16px)',
          background: 'var(--bg-primary)',
          borderBottom: '1px solid var(--card-border)',
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
              style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--charcoal)' }}
            >
              Your people
            </p>
          </div>
        </Link>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
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
        </div>
      </nav>

      {/* Mobile floating action button — expandable */}
      <div className="mobile-nav" style={{ position: 'fixed', right: '1.25rem', bottom: '1.6rem', zIndex: 90 }}>
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
            <Link href="/entries/new" style={{ textDecoration: 'none' }} onClick={() => setFabOpen(false)}>
              <button
                type="button"
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
                }}
              >
                ✨ New Moment
              </button>
            </Link>
            <Link href="/people/new" style={{ textDecoration: 'none' }} onClick={() => setFabOpen(false)}>
              <button
                type="button"
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
                }}
              >
                👤 Add Person
              </button>
            </Link>
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

      <style>{`
        .desktop-nav .nav-link {
          background: transparent;
        }
        .desktop-nav .nav-link:hover {
          background: var(--bg-secondary);
          color: var(--text-primary);
        }
        .desktop-nav .nav-link--active {
          background: var(--bg-secondary);
        }
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
        }
        @media (min-width: 769px) {
          .mobile-nav { display: none !important; }
        }
      `}</style>
    </>
  )
}
