import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { Person } from '@/types'
import type { Entry } from '@/types'
import { getEntryTypeBadgeStyle, getEntryTypeLabel } from '@/lib/entry-type-badges'
import { RELATIONSHIP_COLORS, RELATIONSHIP_BG, formatBirthdayLong } from '@/lib/people'

function formatEntryDate(iso: string): string {
  const d = iso.length === 10 ? new Date(`${iso}T12:00:00`) : new Date(iso)
  if (Number.isNaN(d.getTime())) return ''
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
}

export default async function PersonProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  const [{ data: person }, { data: entries }] = await Promise.all([
    supabase.from('people').select('*').eq('id', id).single(),
    supabase.from('entries').select('*').eq('person_id', id).order('date', { ascending: false }),
  ])

  if (!person) notFound()

  const relColor = RELATIONSHIP_COLORS[person.relationship_type] ?? RELATIONSHIP_COLORS.other
  const relBg = RELATIONSHIP_BG[person.relationship_type] ?? RELATIONSHIP_BG.other
  const entriesList = (entries ?? []) as Entry[]

  return (
    <div style={{ paddingBottom: '5rem', display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
      {/* Hero */}
      <div
        style={{
          borderRadius: '20px',
          padding: '2rem 1.75rem',
          background: relBg,
          border: `1px solid ${relColor}40`,
          position: 'relative',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: '1.5rem',
            flexWrap: 'wrap',
          }}
        >
          <div
            style={{
              width: '72px',
              height: '72px',
              borderRadius: '50%',
              background: 'rgba(255, 255, 255, 0.9)',
              flexShrink: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '2rem',
              color: relColor,
              fontFamily: 'var(--font-heading), serif',
              fontWeight: 700,
              border: `3px solid ${relColor}`,
              boxSizing: 'border-box',
            }}
          >
            {person.name[0].toUpperCase()}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <h1
              className="serif"
              style={{
                fontSize: '2.25rem',
                fontWeight: 700,
                color: 'var(--text-primary)',
                marginBottom: '0.35rem',
              }}
            >
              {person.name}
            </h1>
            <span
              style={{
                display: 'inline-block',
                fontSize: '0.75rem',
                padding: '0.25rem 0.6rem',
                borderRadius: '999px',
                background: 'rgba(255, 255, 255, 0.7)',
                color: relColor,
                textTransform: 'capitalize',
                fontWeight: 600,
                letterSpacing: '0.04em',
                marginBottom: '0.5rem',
              }}
            >
              {person.relationship_type}
            </span>
            {person.birthday && (
              <p
                style={{
                  fontSize: '0.9rem',
                  color: '#6B7280',
                  margin: 0,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                }}
              >
                <span aria-hidden>🎂</span>
                {formatBirthdayLong(person.birthday)}
              </p>
            )}
          </div>
          <Link
            href={`/people/${id}/edit`}
            style={{
              padding: '0.5rem 1rem',
              borderRadius: '12px',
              border: '1px solid var(--card-border)',
              background: 'rgba(255, 255, 255, 0.9)',
              color: 'var(--text-primary)',
              fontSize: '0.875rem',
              fontWeight: 500,
              textDecoration: 'none',
              fontFamily: 'Inter, sans-serif',
              flexShrink: 0,
            }}
          >
            Edit
          </Link>
        </div>
      </div>

      {person.notes && (
        <section>
          <h2
            style={{
              fontSize: '0.7rem',
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: '#747a84',
              marginBottom: '0.6rem',
              fontWeight: 600,
            }}
          >
            About
          </h2>
          <div
            style={{
              padding: '1.25rem 1.5rem',
              background: 'var(--card-bg)',
              border: '1px solid var(--card-border)',
              borderRadius: '14px',
              boxShadow: '0 2px 12px rgba(124, 58, 237, 0.04)',
            }}
          >
            <p
              style={{
                fontSize: '0.95rem',
                color: 'var(--text-secondary)',
                lineHeight: 1.65,
                margin: 0,
              }}
            >
              {person.notes}
            </p>
          </div>
        </section>
      )}

      {/* Add entry CTA */}
      <div>
        <Link
          href={`/entries/new?person_id=${id}`}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.7rem 1.4rem',
            borderRadius: '50px',
            background: 'var(--accent)',
            color: '#fff',
            fontSize: '0.9rem',
            fontWeight: 500,
            textDecoration: 'none',
            fontFamily: 'Inter, sans-serif',
            boxShadow: '0 4px 14px rgba(124, 58, 237, 0.35)',
          }}
        >
          + Add entry
        </Link>
      </div>

      {/* Entries */}
      <section>
        <h2
          className="serif"
          style={{
            fontSize: '1.5rem',
            fontWeight: 700,
            color: 'var(--text-primary)',
            marginBottom: '1rem',
          }}
        >
          Moments & notes
        </h2>
        {!entriesList.length ? (
          <div
            style={{
              padding: '2.5rem 1.5rem',
              textAlign: 'center',
              background: 'var(--card-bg)',
              border: '1px solid var(--card-border)',
              borderRadius: '16px',
            }}
          >
            <p
              style={{
                fontSize: '0.95rem',
                color: '#6B7280',
                marginBottom: '1.25rem',
                lineHeight: 1.5,
              }}
            >
              Nothing here yet. What do you know about {person.name}?
            </p>
            <Link
              href={`/entries/new?person_id=${id}`}
              style={{
                display: 'inline-block',
                padding: '0.6rem 1.25rem',
                borderRadius: '50px',
                background: 'var(--accent)',
                color: '#fff',
                fontSize: '0.875rem',
                fontWeight: 500,
                textDecoration: 'none',
              }}
            >
              Add first entry
            </Link>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {entriesList.map((entry) => {
              const badge = getEntryTypeBadgeStyle(entry.type)
              return (
                <Link
                  key={entry.id}
                  href={`/entries/${entry.id}`}
                  style={{ textDecoration: 'none' }}
                >
                  <div
                    style={{
                      display: 'flex',
                      gap: '1rem',
                      alignItems: 'flex-start',
                      padding: '1rem 1.25rem',
                      background: 'var(--card-bg)',
                      border: '1px solid var(--card-border)',
                      borderRadius: '14px',
                      transition: 'box-shadow 0.2s ease, border-color 0.2s ease',
                    }}
                    className="card--clickable"
                  >
                    <span
                      style={{
                        fontSize: '0.65rem',
                        letterSpacing: '0.06em',
                        textTransform: 'uppercase',
                        background: badge.background,
                        color: badge.color,
                        padding: '0.3rem 0.6rem',
                        borderRadius: '8px',
                        fontWeight: 600,
                        flexShrink: 0,
                      }}
                    >
                      {getEntryTypeLabel(entry.type)}
                    </span>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p
                        style={{
                          fontSize: '0.95rem',
                          fontWeight: 600,
                          color: 'var(--text-primary)',
                          marginBottom: '0.2rem',
                        }}
                      >
                        {entry.title}
                      </p>
                      {entry.body && (
                        <p
                          style={{
                            fontSize: '0.85rem',
                            color: '#6B7280',
                            marginBottom: '0.35rem',
                            lineHeight: 1.4,
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                          }}
                        >
                          {entry.body}
                        </p>
                      )}
                      <p style={{ fontSize: '0.8rem', color: '#9CA3AF', margin: 0 }}>
                        {formatEntryDate(entry.date)}
                      </p>
                    </div>
                    <span style={{ color: '#A78BFA', fontSize: '1rem', opacity: 0.8 }}>›</span>
                  </div>
                </Link>
              )
            })}
          </div>
        )}
      </section>
    </div>
  )
}
