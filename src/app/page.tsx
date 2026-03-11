import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function LandingPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (user) redirect('/dashboard')

  return (
    <main style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Nav */}
      <nav style={{ padding: '1.5rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span className="serif" style={{ fontSize: '1.5rem', fontWeight: 400, color: 'var(--terracotta)' }}>
          Cherish
        </span>
        <Link href="/login">
          <button className="btn-secondary" style={{ fontSize: '0.8rem' }}>Sign in</button>
        </Link>
      </nav>

      {/* Hero */}
      <section style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: '4rem 1.5rem',
        maxWidth: '640px',
        margin: '0 auto',
      }}>
        <p className="fade-up" style={{
          fontSize: '0.7rem',
          letterSpacing: '0.15em',
          textTransform: 'uppercase',
          color: 'var(--terracotta)',
          marginBottom: '1.5rem',
          animationDelay: '0s',
        }}>
          A relationship memory companion
        </p>
        <h1 className="serif fade-up" style={{
          fontSize: 'clamp(2.5rem, 7vw, 4.5rem)',
          fontWeight: 600,
          lineHeight: 1.1,
          color: 'var(--charcoal)',
          marginBottom: '1.5rem',
          animationDelay: '0.1s',
          opacity: 0,
        }}>
          Never forget what matters<br />
          <em style={{ color: 'var(--terracotta)' }}>to the people who matter.</em>
        </h1>
        <p className="fade-up" style={{
          fontSize: '1rem',
          color: 'var(--muted)',
          lineHeight: 1.7,
          marginBottom: '2.5rem',
          maxWidth: '400px',
          animationDelay: '0.2s',
          opacity: 0,
        }}>
          A private space to remember the little things — stories shared, gifts exchanged,
          moments that meant something.
        </p>
        <div className="fade-up" style={{ animationDelay: '0.3s', opacity: 0 }}>
          <Link href="/login">
            <button className="btn-primary" style={{ padding: '0.8rem 2rem', fontSize: '0.9rem' }}>
              Start remembering
            </button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ padding: '2rem', textAlign: 'center' }}>
        <p style={{ fontSize: '0.75rem', color: 'var(--muted)' }}>
          Built with care. Your data is always private.
        </p>
      </footer>
    </main>
  )
}
