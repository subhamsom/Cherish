'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

const navLinks = [
  { href: '/dashboard', label: 'Home', icon: '◇' },
  { href: '/people', label: 'People', icon: '○' },
  { href: '/entries/new', label: '+ Add', icon: null, primary: true },
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
      <nav style={{
        width: '200px',
        minHeight: '100vh',
        borderRight: '1px solid var(--border)',
        padding: '2rem 1.5rem',
        display: 'flex',
        flexDirection: 'column',
        position: 'sticky',
        top: 0,
        height: '100vh',
      }} className="desktop-nav">
        <Link href="/dashboard" style={{ textDecoration: 'none' }}>
          <h2 className="serif" style={{ fontSize: '1.5rem', fontWeight: 400, color: 'var(--terracotta)', marginBottom: '2.5rem' }}>
            Cherish
          </h2>
        </Link>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', flex: 1 }}>
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} style={{ textDecoration: 'none' }}>
              <div style={{
                padding: '0.6rem 0.75rem',
                borderRadius: '2px',
                fontSize: link.primary ? '0.8rem' : '0.875rem',
                fontWeight: link.primary ? 500 : 300,
                letterSpacing: link.primary ? '0.05em' : 'normal',
                background: link.primary ? 'var(--terracotta)' : pathname === link.href ? 'var(--warm-white)' : 'transparent',
                color: link.primary ? 'white' : pathname === link.href ? 'var(--charcoal)' : 'var(--muted)',
                transition: 'all 0.15s ease',
                marginBottom: link.primary ? '0.5rem' : 0,
                textAlign: link.primary ? 'center' : 'left',
              }}>
                {link.icon && !link.primary && <span style={{ marginRight: '0.5rem', fontSize: '0.7rem' }}>{link.icon}</span>}
                {link.label}
              </div>
            </Link>
          ))}
        </div>

        <button
          type="button"
          onClick={handleSignOut}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            fontSize: '0.75rem',
            color: 'var(--muted)',
            padding: '0.5rem 0.75rem',
            textAlign: 'left',
            width: '100%',
          }}
        >
          Sign out
        </button>
      </nav>

      {/* Mobile bottom bar */}
      <nav style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        background: 'var(--card)',
        borderTop: '1px solid var(--border)',
        display: 'flex',
        justifyContent: 'space-around',
        padding: '0.75rem 0',
        zIndex: 100,
      }} className="mobile-nav">
        {navLinks.map((link) => (
          <Link key={link.href} href={link.href} style={{ textDecoration: 'none' }}>
            <div style={{
              textAlign: 'center',
              fontSize: '0.7rem',
              color: link.primary ? 'var(--terracotta)' : pathname === link.href ? 'var(--charcoal)' : 'var(--muted)',
              fontWeight: pathname === link.href || link.primary ? 500 : 300,
            }}>
              {link.label}
            </div>
          </Link>
        ))}
      </nav>

      <style>{`
        @media (max-width: 640px) {
          .desktop-nav { display: none !important; }
        }
        @media (min-width: 641px) {
          .mobile-nav { display: none !important; }
        }
      `}</style>
    </>
  )
}
