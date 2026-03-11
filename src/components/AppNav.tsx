'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

const navLinks = [
  { href: '/dashboard', label: 'Home', icon: '◎' },
  { href: '/people', label: 'People', icon: '☺' },
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
          borderRight: '1px solid var(--border-subtle)',
          padding: '2rem 1.75rem 2rem',
          display: 'flex',
          flexDirection: 'column',
          position: 'sticky',
          top: 0,
          background:
            'radial-gradient(circle at top left, rgba(250, 243, 232, 0.08), transparent 55%)',
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
                fontWeight: 400,
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
                      ? 'linear-gradient(135deg, var(--terracotta), var(--terracotta-light))'
                      : undefined,
                    color: isPrimary
                      ? '#1B120E'
                      : isActive
                      ? 'var(--charcoal)'
                      : 'var(--charcoal-muted)',
                    border: isPrimary
                      ? '1px solid rgba(255, 255, 255, 0.5)'
                      : '1px solid transparent',
                    borderLeft: !isPrimary ? (isActive ? '3px solid var(--terracotta)' : '3px solid transparent') : undefined,
                    boxShadow: isPrimary
                      ? '0 14px 28px rgba(207, 106, 59, 0.5)'
                      : undefined,
                    transition: 'all 0.16s ease',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem' }}>
                    {link.icon && (
                      <span
                        aria-hidden
                        style={{
                          fontSize: isPrimary ? '0.9rem' : '0.8rem',
                          opacity: isPrimary || isActive ? 1 : 0.7,
                        }}
                      >
                        {link.icon}
                      </span>
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
                        background: 'var(--terracotta)',
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
          background: 'linear-gradient(to bottom, rgba(250, 246, 240, 0.98), rgba(250, 246, 240, 0.85), transparent)',
          borderBottom: '1px solid var(--border-subtle)',
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
              style={{ fontSize: '1.1rem', fontWeight: 400, color: 'var(--charcoal)' }}
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
                        ? 'rgba(201, 106, 63, 0.12)'
                        : 'rgba(47, 37, 32, 0.06)',
                      color: isActive ? 'var(--terracotta)' : 'var(--charcoal-muted)',
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
            borderRadius: 999,
            border: 'none',
            background:
              'radial-gradient(circle at top left, #FFE6D3 0, #F3C19E 55%, #E58757 100%)',
            color: '#20120A',
            fontSize: '0.8rem',
            fontWeight: 600,
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            boxShadow:
              '0 18px 40px rgba(0, 0, 0, 0.75), 0 0 0 1px rgba(255, 255, 255, 0.5)',
          }}
        >
          <span
            aria-hidden
            style={{
              width: '22px',
              height: '22px',
              borderRadius: '999px',
              background: '#20120A',
              color: '#FFE6D3',
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
          background: rgba(201, 106, 63, 0.08);
          color: var(--charcoal);
        }
        .desktop-nav .nav-link--active {
          background: rgba(201, 106, 63, 0.1);
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
