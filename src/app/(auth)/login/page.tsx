'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleGoogleSignIn() {
    setError(null)
    setLoading(true)
    const supabase = createClient()
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${typeof window !== 'undefined' ? window.location.origin : ''}/auth/callback`,
      },
    })
    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }
    if (data?.url) window.location.href = data.url
    else setLoading(false)
  }

  return (
    <main className="login-page">
      <div
        className="login-page__card"
        style={{
          background: '#F5F3FF',
          borderRadius: '20px',
          padding: '48px',
          maxWidth: '400px',
          width: '100%',
          textAlign: 'center',
        }}
      >
        <header className="login-page__header" style={{ marginBottom: '1.5rem' }}>
          <div
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: '40px',
              fontWeight: 600,
              color: '#7C3AED',
              marginBottom: '0.5rem',
            }}
          >
            Cherish
          </div>
          <p
            style={{
              fontFamily: 'Inter, sans-serif',
              fontStyle: 'italic',
              fontSize: '18px',
              color: '#4B5563',
              margin: 0,
            }}
          >
            Remember what matters
          </p>
        </header>

        <section className="login-page__hero" style={{ marginBottom: '1.5rem' }}>
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="btn-google-signin"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.6rem',
              width: '100%',
              background: '#FFFFFF',
              border: '1.5px solid #7C3AED',
              color: '#7C3AED',
              borderRadius: '50px',
              padding: '14px 32px',
              fontFamily: 'Inter, sans-serif',
              fontSize: '0.95rem',
              fontWeight: 500,
              cursor: 'pointer',
            }}
          >
            <span className="btn-google-hero__icon" aria-hidden>
              <GoogleIcon />
            </span>
            {loading ? 'Taking you to Google…' : 'Continue with Google'}
          </button>
          {error && (
            <p className="login-page__error">{error}</p>
          )}
          <p
            style={{
              fontSize: '12px',
              color: '#9CA3AF',
              marginTop: '1.25rem',
              marginBottom: 0,
            }}
          >
            Your memories are private and secure.
          </p>
        </section>
      </div>
    </main>
  )
}

function GoogleIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      />
    </svg>
  )
}
