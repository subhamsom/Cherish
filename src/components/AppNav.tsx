'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Home, Users } from 'lucide-react'

const navLinks = [
  { href: '/dashboard', label: 'Home', icon: 'home' as const },
  { href: '/people', label: 'People', icon: 'people' as const },
  { href: '/entries/new', label: 'New moment', icon: '+', primary: true },
]

export default function AppNav() {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()

  async function handleSignOut() {
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

        <div style={{ marginTop: '1.5rem' }}>
          <button
            type="button"
            onClick={handleSignOut}
            style={{
              width: '100%',
              background: 'transparent',
              borderRadius: 999,
              border: '1px solid var(--border-subtle)',
              padding: '0.45rem 0.9rem',
              fontSize: '0.75rem',
              color: 'var(--charcoal-muted)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
          >
            <span>Sign out</span>
            <span aria-hidden style={{ fontSize: '0.85rem' }}>
              ↗
            </span>
          </button>
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

      {/* Mobile floating add button */}
      <Link href="/entries/new" className="mobile-nav" style={{ textDecoration: 'none' }}>
        <button
          type="button"
            style={{
              position: 'fixed',
              right: '1.25rem',
              bottom: '1.6rem',
              zIndex: 90,
              padding: '0.85rem 1.1rem',
              borderRadius: 12,
              border: 'none',
              background: 'var(--accent)',
              color: '#FFFFFF',
              fontSize: '0.8rem',
              fontWeight: 600,
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              boxShadow: '0 4px 14px rgba(124, 58, 237, 0.4)',
            }}
        >
          <span
            aria-hidden
            style={{
              width: '22px',
              height: '22px',
              borderRadius: '999px',
              background: 'rgba(255,255,255,0.3)',
              color: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1rem',
            }}
          >
            +
          </span>
          New entry
        </button>
      </Link>

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
