import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function LandingPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (user) redirect('/dashboard')

  return (
    <main style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#FAFAFA' }}>
      {/* Nav — no Sign in, just space for balance */}
      <nav style={{ padding: '1.5rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
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
        <span style={{ width: 1, height: 1 }} aria-hidden />
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
          fontSize: '11px',
          letterSpacing: '0.15em',
          textTransform: 'uppercase',
          color: '#A78BFA',
          marginBottom: '1.5rem',
          animationDelay: '0s',
        }}>
          YOUR RELATIONSHIP MEMORY COMPANION
        </p>
        <h1 className="fade-up heading-serif" style={{
          fontSize: 'clamp(3.125rem, 8.75vw, 5.625rem)',
          fontWeight: 700,
          lineHeight: 1.1,
          color: '#1F1F1F',
          marginBottom: '1.5rem',
          animationDelay: '0.1s',
        }}>
          Never forget what matters<br />
          <em style={{ fontFamily: 'Inter, sans-serif', fontStyle: 'italic', color: 'var(--terracotta)' }}>to the people who matter.</em>
        </h1>
        <p className="fade-up" style={{
          fontFamily: 'Inter, sans-serif',
          fontSize: '1rem',
          color: '#6B7280',
          lineHeight: 1.7,
          marginBottom: '2.5rem',
          maxWidth: '420px',
          marginLeft: 'auto',
          marginRight: 'auto',
          animationDelay: '0.2s',
        }}>
          A private space to remember the little things — stories shared, gifts exchanged,
          moments that meant something.
        </p>
        <div className="fade-up" style={{ animationDelay: '0.3s' }}>
          <Link href="/login">
            <button
              type="button"
              style={{
                padding: '16px 40px',
                borderRadius: '50px',
                border: 'none',
                background: 'var(--accent)',
                color: '#FFFFFF',
                fontFamily: 'Inter, sans-serif',
                fontSize: '0.95rem',
                fontWeight: 500,
                cursor: 'pointer',
                boxShadow: '0 4px 14px rgba(124, 58, 237, 0.35)',
              }}
            >
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
