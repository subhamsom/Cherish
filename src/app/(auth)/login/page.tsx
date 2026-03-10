'use client'

import { useState } from 'react'
import { login, signup } from '@/app/auth/actions'

export default function LoginPage() {
  const [mode, setMode] = useState<'login' | 'signup'>('login')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(formData: FormData) {
    setError(null)
    setLoading(true)
    const action = mode === 'login' ? login : signup
    const result = await action(formData)
    if (result?.error) {
      setError(result.error)
      setLoading(false)
    }
  }

  return (
    <main style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1.5rem',
    }}>
      <div style={{ width: '100%', maxWidth: '400px' }}>
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <h1 className="serif" style={{ fontSize: '2rem', fontWeight: 400, color: 'var(--terracotta)', marginBottom: '0.5rem' }}>
            Cherish
          </h1>
          <p style={{ color: 'var(--muted)', fontSize: '0.875rem' }}>
            {mode === 'login' ? 'Welcome back.' : 'Start remembering what matters.'}
          </p>
        </div>

        <div className="card" style={{ padding: '2rem' }}>
          <form action={handleSubmit}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {mode === 'signup' && (
                <div>
                  <label className="label" htmlFor="name">Your name</label>
                  <input className="input" id="name" name="name" type="text" placeholder="Your name" required />
                </div>
              )}
              <div>
                <label className="label" htmlFor="email">Email</label>
                <input className="input" id="email" name="email" type="email" placeholder="you@example.com" required />
              </div>
              <div>
                <label className="label" htmlFor="password">Password</label>
                <input className="input" id="password" name="password" type="password" placeholder="••••••••" required minLength={6} />
              </div>
              {error && (
                <p style={{ fontSize: '0.8rem', color: '#C0392B', textAlign: 'center' }}>{error}</p>
              )}
              <button
                type="submit"
                className="btn-primary"
                disabled={loading}
                style={{ width: '100%', padding: '0.75rem', opacity: loading ? 0.7 : 1 }}
              >
                {loading ? 'Please wait…' : mode === 'login' ? 'Sign in' : 'Create account'}
              </button>
            </div>
          </form>

          <div style={{ marginTop: '1.5rem', textAlign: 'center', borderTop: '1px solid var(--border)', paddingTop: '1.5rem' }}>
            <p style={{ fontSize: '0.8rem', color: 'var(--muted)' }}>
              {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
              <button
                onClick={() => { setMode(mode === 'login' ? 'signup' : 'login'); setError(null) }}
                style={{ color: 'var(--terracotta)', background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 500 }}
              >
                {mode === 'login' ? 'Sign up' : 'Sign in'}
              </button>
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}
