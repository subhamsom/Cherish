import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import type { Person } from '@/types'
import { getEntryTypeBadgeStyle, getEntryTypeLabel } from '@/lib/entry-type-badges'

export default async function PersonProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  const [{ data: person }, { data: entries }] = await Promise.all([
    supabase.from('people').select('*').eq('id', id).single(),
    supabase.from('entries').select('*').eq('person_id', id).order('date', { ascending: false }),
  ])

  if (!person) notFound()

  return (
    <div style={{ paddingBottom: '5rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1.5rem', marginBottom: '2.5rem' }}>
        <div style={{
          width: '64px', height: '64px', borderRadius: '50%', flexShrink: 0,
          background: '#EDE9FE',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '1.8rem', color: '#7C3AED',
          fontFamily: 'Inter, sans-serif', fontWeight: 600,
        }}>
          {person.name[0].toUpperCase()}
        </div>
        <div style={{ flex: 1 }}>
          <h1 className="serif" style={{ fontSize: '2.5rem', fontWeight: 700, marginBottom: '0.2rem' }}>{person.name}</h1>
          <p style={{ fontSize: '0.8rem', color: 'var(--muted)', textTransform: 'capitalize', marginBottom: '0.5rem' }}>{person.relationship_type}</p>
          {person.birthday && (
            <p style={{ fontSize: '0.8rem', color: 'var(--muted)' }}>
              🎂 {new Date(person.birthday + 'T00:00:00').toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}
            </p>
          )}
        </div>
        <Link href={`/people/${id}/edit`}>
          <button className="btn-secondary" style={{ fontSize: '0.75rem' }}>Edit</button>
        </Link>
      </div>

      {person.notes && (
        <div className="card" style={{ marginBottom: '2rem', background: 'var(--bg-secondary)' }}>
          <p style={{ fontSize: '0.75rem', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: '0.5rem' }}>About</p>
          <p style={{ fontSize: '0.875rem', color: 'var(--charcoal-light)', lineHeight: 1.6 }}>{person.notes}</p>
        </div>
      )}

      {/* Quick add */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '2rem' }}>
        <Link href={`/entries/new?person_id=${id}`}>
          <button className="btn-primary">+ Add entry</button>
        </Link>
      </div>

      {/* Entries */}
      <section>
        <h2 className="serif" style={{ fontSize: '1.625rem', fontWeight: 700, marginBottom: '1rem' }}>Entries</h2>
        {!entries?.length ? (
          <div className="card" style={{ textAlign: 'center', padding: '2.5rem' }}>
            <p style={{ color: 'var(--muted)', fontSize: '0.875rem', marginBottom: '1rem' }}>
              Nothing here yet. What do you know about {person.name}?
            </p>
            <Link href={`/entries/new?person_id=${id}`}>
              <button className="btn-primary">Add first entry</button>
            </Link>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {(entries as Entry[]).map((entry) => (
              <Link key={entry.id} href={`/entries/${entry.id}`} style={{ textDecoration: 'none' }}>
                <div className="card card--clickable" style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                  <span
                    style={{
                      fontSize: '0.65rem',
                      letterSpacing: '0.06em',
                      textTransform: 'uppercase',
                      background: getEntryTypeBadgeStyle(entry.type).background,
                      color: getEntryTypeBadgeStyle(entry.type).color,
                      padding: '0.25rem 0.5rem',
                      borderRadius: '6px',
                      whiteSpace: 'nowrap',
                      marginTop: '0.15rem',
                    }}
                  >
                    {getEntryTypeLabel(entry.type)}
                  </span>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: '0.9rem', fontWeight: 400, color: 'var(--charcoal)', marginBottom: '0.2rem' }}>{entry.title}</p>
                    <p style={{ fontSize: '0.75rem', color: 'var(--muted)' }}>
                      {new Date(entry.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </p>
                  </div>
                  {entry.mood && <span style={{ fontSize: '1.1rem' }}>{entry.mood}</span>}
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
