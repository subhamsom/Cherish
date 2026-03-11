import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import type { Person } from '@/types'

export default async function DashboardPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const [{ data: people }, { data: entries }] = await Promise.all([
    supabase.from('people').select('*').order('created_at', { ascending: false }),
    supabase
      .from('entries')
      .select('*, people(name)')
      .order('created_at', { ascending: false })
      .limit(4),
  ])

  const firstName = user?.user_metadata?.name?.split(' ')[0] || 'there'

  return (
    <div style={{ paddingBottom: '5rem', display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
      {/* Greeting / hero */}
      <section>
        <div
          className="card card--subtle"
          style={{
            padding: '1.6rem 1.6rem 1.4rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.75rem',
          }}
        >
          <p
            style={{
              fontSize: '0.7rem',
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              color: 'var(--charcoal-muted)',
            }}
          >
            {new Date().toLocaleDateString('en-US', {
              weekday: 'long',
              month: 'long',
              day: 'numeric',
            })}
          </p>
          <h1
            className="serif"
            style={{ fontSize: '2.1rem', fontWeight: 300, color: 'var(--cream)', margin: 0 }}
          >
            Hello, {firstName}
          </h1>
          <p style={{ fontSize: '0.9rem', color: 'var(--charcoal-soft)', maxWidth: '30rem' }}>
            Take a moment to remember someone you care about. The little details you capture
            today become tomorrow&apos;s favorite stories.
          </p>
          <div style={{ marginTop: '0.5rem', display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
            <Link href="/entries/new">
              <button className="btn-primary">Capture a moment</button>
            </Link>
            <Link href="/people/new">
              <button className="btn-secondary">Add someone new</button>
            </Link>
          </div>
        </div>
      </section>

      {/* People section */}
      <section>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            marginBottom: '1.1rem',
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
                marginBottom: '0.2rem',
              }}
            >
              Your people
            </p>
            <h2
              className="serif"
              style={{ fontSize: '1.4rem', fontWeight: 400, color: 'var(--cream)', margin: 0 }}
            >
              Circle of care
            </h2>
          </div>
          <Link href="/people/new" style={{ textDecoration: 'none' }}>
            <button className="btn-secondary">+ Add person</button>
          </Link>
        </div>

        {!people?.length ? (
          <div className="card card--subtle" style={{ textAlign: 'left', padding: '2.2rem' }}>
            <p
              className="serif"
              style={{ fontSize: '1.3rem', color: 'var(--cream)', marginBottom: '0.75rem' }}
            >
              Who lights up your world?
            </p>
            <p
              style={{
                fontSize: '0.9rem',
                color: 'var(--charcoal-soft)',
                marginBottom: '1.4rem',
                maxWidth: '26rem',
              }}
            >
              Add the people who matter most so you can notice the small, beautiful things about
              them.
            </p>
            <Link href="/people/new">
              <button className="btn-primary">Add your first person</button>
            </Link>
          </div>
        ) : (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
              gap: '0.9rem',
            }}
          >
            {(people as Person[]).map((person) => (
              <Link key={person.id} href={`/people/${person.id}`} style={{ textDecoration: 'none' }}>
                <div
                  className="card card--clickable"
                  style={{
                    padding: '1.1rem 1.1rem 1rem',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    gap: '0.55rem',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.7rem',
                      width: '100%',
                      justifyContent: 'space-between',
                    }}
                  >
                    <div
                      style={{
                        width: '44px',
                        height: '44px',
                        borderRadius: '50%',
                        background:
                          'radial-gradient(circle at 20% 0%, #FFE6D7 0, #F1B9A0 45%, #D97857 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '1.3rem',
                        color: '#2A1710',
                        fontFamily: 'Cormorant Garamond, serif',
                        fontWeight: 600,
                      }}
                    >
                      {person.name[0].toUpperCase()}
                    </div>
                    <span
                      style={{
                        fontSize: '0.7rem',
                        textTransform: 'uppercase',
                        letterSpacing: '0.13em',
                        color: 'var(--charcoal-muted)',
                      }}
                    >
                      {person.relationship_type}
                    </span>
                  </div>
                  <p
                    style={{
                      fontSize: '0.95rem',
                      fontWeight: 400,
                      color: 'var(--cream)',
                    }}
                  >
                    {person.name}
                  </p>
                  {person.birthday && (
                    <p style={{ fontSize: '0.8rem', color: 'var(--charcoal-soft)' }}>
                      🎂{' '}
                      {new Date(person.birthday + 'T00:00:00').toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                      })}
                    </p>
                  )}
                </div>
              </Link>
            ))}
            <Link href="/people/new" style={{ textDecoration: 'none' }}>
              <div
                className="card card--clickable"
                style={{
                  padding: '1.1rem 1.1rem',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderStyle: 'dashed',
                  borderColor: 'rgba(250, 243, 232, 0.5)',
                  borderWidth: '1px',
                }}
              >
                <div
                  style={{
                    width: '46px',
                    height: '46px',
                    borderRadius: '50%',
                    border: '1px dashed rgba(250, 243, 232, 0.7)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '0.55rem',
                    color: 'var(--charcoal-soft)',
                    fontSize: '1.4rem',
                  }}
                >
                  +
                </div>
                <p style={{ fontSize: '0.8rem', color: 'var(--charcoal-soft)' }}>
                  Add another person
                </p>
              </div>
            </Link>
          </div>
        )}
      </section>

      {/* Recent entries */}
      <section>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            marginBottom: '1.1rem',
          }}
        >
          <div>
            <p
              style={{
                fontSize: '0.7rem',
                letterSpacing: '0.16em',
                textTransform: 'uppercase',
                color: 'var(--charcoal-muted)',
                marginBottom: '0.2rem',
              }}
            >
              Recent activity
            </p>
            <h2
              className="serif"
              style={{ fontSize: '1.4rem', fontWeight: 400, color: 'var(--cream)', margin: 0 }}
            >
              Moments you&apos;ve saved
            </h2>
          </div>
          <Link href="/entries/new" style={{ textDecoration: 'none' }}>
            <button className="btn-secondary">+ New entry</button>
          </Link>
        </div>

        {!entries?.length ? (
          <div className="card card--subtle" style={{ padding: '2rem' }}>
            <p
              style={{
                color: 'var(--charcoal-soft)',
                fontSize: '0.9rem',
                textAlign: 'left',
                maxWidth: '26rem',
              }}
            >
              Once you add a few people and capture a moment, they&apos;ll appear here so you can
              revisit them quickly.
            </p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {(entries as any[]).map((entry) => (
              <Link
                key={entry.id}
                href={`/entries/${entry.id}`}
                style={{ textDecoration: 'none' }}
              >
                <div
                  className="card card--clickable"
                  style={{
                    display: 'flex',
                    gap: '1rem',
                    alignItems: 'flex-start',
                    padding: '1rem 1.25rem',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'flex-start',
                      gap: '0.25rem',
                      minWidth: '130px',
                    }}
                  >
                    <span
                      style={{
                        fontSize: '0.65rem',
                        letterSpacing: '0.12em',
                        textTransform: 'uppercase',
                        color: '#1F130E',
                        background:
                          'linear-gradient(135deg, rgba(250, 243, 232, 0.98), rgba(244, 225, 210, 0.96))',
                        padding: '0.2rem 0.55rem',
                        borderRadius: '999px',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {entry.type.replace('_', ' ')}
                    </span>
                    <p
                      style={{
                        fontSize: '0.75rem',
                        color: 'var(--charcoal-soft)',
                      }}
                    >
                      {entry.people?.name
                        ? entry.people.name
                        : 'Someone special'}{' '}
                      ·{' '}
                      {new Date(entry.date).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                      })}
                    </p>
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p
                      style={{
                        fontSize: '0.95rem',
                        fontWeight: 400,
                        color: 'var(--cream)',
                        marginBottom: '0.15rem',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical' as any,
                      }}
                    >
                      {entry.title}
                    </p>
                  </div>
                  {entry.mood && (
                    <span style={{ fontSize: '1.2rem', marginLeft: '0.25rem' }}>{entry.mood}</span>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
