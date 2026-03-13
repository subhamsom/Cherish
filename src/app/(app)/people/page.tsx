import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import type { Person } from '@/types'

const RELATIONSHIP_BORDER_COLORS: Record<string, string> = {
  partner: '#F9A8D4',
  friend: '#93C5FD',
  family: '#86EFAC',
  colleague: '#FCD34D',
  other: '#C4B5FD',
}

export default async function PeoplePage() {
  const supabase = await createClient()
  const { data: people, error: peopleError } = await supabase
    .from('people')
    .select('*, entries(count)')
    .order('name')

  if (peopleError) {
    console.error('[People page] Supabase error:', peopleError.message, peopleError.details)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {peopleError && (
        <div role="alert" style={{ padding: '1rem', background: '#FEE2E2', color: '#991B1B', borderRadius: '8px', fontSize: '0.875rem' }}>
          Couldn&apos;t load people: {peopleError.message}. Check the terminal for details and ensure Supabase tables and RLS are set up.
        </div>
      )}
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
            style={{ fontSize: '2.5rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}
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
            style={{ fontSize: '1.875rem', color: 'var(--text-primary)', marginBottom: '0.9rem' }}
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
          {(people as (Person & { entries?: unknown })[]).map((person) => {
            let entryCount = 0
            if (Array.isArray(person.entries) && person.entries[0] != null && typeof (person.entries[0] as { count?: number }).count === 'number') {
              entryCount = (person.entries[0] as { count: number }).count
            } else if (typeof (person.entries as number) === 'number') {
              entryCount = person.entries as number
            }
            const borderColor = RELATIONSHIP_BORDER_COLORS[person.relationship_type] ?? RELATIONSHIP_BORDER_COLORS.other
            return (
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
                      background: '#EDE9FE',
                      flexShrink: 0,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '1.15rem',
                      color: '#7C3AED',
                      fontFamily: 'Inter, sans-serif',
                      fontWeight: 600,
                      border: `3px solid ${borderColor}`,
                      boxSizing: 'border-box',
                    }}
                  >
                    {person.name[0].toUpperCase()}
                  </div>
                  <div style={{ flex: 1 }}>
                    <p
                      style={{
                        fontSize: '0.96rem',
                        fontWeight: 400,
                        color: 'var(--text-primary)',
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
                    <p style={{ fontSize: '0.7rem', color: 'var(--charcoal-muted)', marginTop: '0.15rem' }}>
                      {entryCount === 0 ? 'No moments yet' : `${entryCount} moment${entryCount === 1 ? '' : 's'}`}
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
            )
          })}
        </div>
      )}
    </div>
  )
}
