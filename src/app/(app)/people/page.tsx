import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import type { Person } from '@/types'

export default async function PeoplePage() {
  const supabase = await createClient()
  const { data: people } = await supabase.from('people').select('*').order('name')

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          gap: '0.75rem',
        }}
      >
        <div>
          <p
            style={{
              fontSize: '0.7rem',
              letterSpacing: '0.16em',
              textTransform: 'uppercase',
              color: 'var(--charcoal-muted)',
              marginBottom: '0.25rem',
            }}
          >
            Your circle
          </p>
          <h1
            className="serif"
            style={{ fontSize: '2rem', fontWeight: 300, color: '#2C2C2C', margin: 0 }}
          >
            People
          </h1>
        </div>
        <Link href="/people/new">
          <button className="btn-primary">+ Add person</button>
        </Link>
      </div>

      {!people?.length ? (
        <div className="card card--subtle" style={{ padding: '2.6rem 2.4rem' }}>
          <p
            className="serif"
            style={{ fontSize: '1.5rem', color: '#2C2C2C', marginBottom: '0.9rem' }}
          >
            Everyone you love lives here.
          </p>
          <p
            style={{
              fontSize: '0.9rem',
              color: 'var(--charcoal-soft)',
              marginBottom: '1.6rem',
              maxWidth: '26rem',
            }}
          >
            Start with one person you&apos;d like to notice more often. Their page will become a
            home for the stories you collect.
          </p>
          <Link href="/people/new">
            <button className="btn-primary">Add your first person</button>
          </Link>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.7rem' }}>
          {(people as Person[]).map((person) => (
            <Link key={person.id} href={`/people/${person.id}`} style={{ textDecoration: 'none' }}>
              <div
                className="card card--clickable"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                  padding: '0.95rem 1.2rem',
                }}
              >
                <div
                  style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '50%',
                    background:
                      'radial-gradient(circle at 20% 0%, #FFE5D4 0, #F3B99F 45%, #D97857 100%)',
                    flexShrink: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.15rem',
                    color: '#2A1710',
                    fontFamily: 'Cormorant Garamond, serif',
                    fontWeight: 600,
                  }}
                >
                  {person.name[0].toUpperCase()}
                </div>
                <div style={{ flex: 1 }}>
                  <p
                    style={{
                      fontSize: '0.96rem',
                      fontWeight: 400,
                      color: '#2C2C2C',
                      marginBottom: '0.15rem',
                    }}
                  >
                    {person.name}
                  </p>
                  <p
                    style={{
                      fontSize: '0.75rem',
                      color: 'var(--charcoal-soft)',
                      textTransform: 'capitalize',
                      letterSpacing: '0.06em',
                    }}
                  >
                    {person.relationship_type}
                  </p>
                </div>
                {person.birthday && (
                  <p style={{ fontSize: '0.75rem', color: 'var(--charcoal-soft)' }}>
                    🎂{' '}
                    {new Date(person.birthday + 'T00:00:00').toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                    })}
                  </p>
                )}
                <span style={{ color: 'var(--charcoal-muted)', fontSize: '0.9rem' }}>›</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
