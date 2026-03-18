import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import type { Person } from '@/types'
import AddPersonButton from '@/components/dashboard/AddPersonButton'
import { RELATIONSHIP_COLORS, RELATIONSHIP_BG, formatDayMonth, formatBirthday } from '@/lib/people'

export default async function PeoplePage() {
  const supabase = await createClient()
  const { data: people, error: peopleError } = await supabase
    .from('people')
    .select('*')
    .order('name')

  if (peopleError) {
    console.error('[People page] Supabase error:', peopleError.message, peopleError.details)
  }

  const peopleList = (people as Person[]) ?? []
  const peopleIds = peopleList.map((p) => p.id)

  const statsByPersonId = new Map<string, { count: number; lastDate: string | null }>()

  if (!peopleError && peopleIds.length > 0) {
    const { data: entries, error: entriesError } = await supabase
      .from('entries')
      .select('person_id, created_at, date')
      .in('person_id', peopleIds)
      .order('created_at', { ascending: false })

    if (entriesError) {
      console.error('[People page] entries stats error:', entriesError.message, entriesError.details)
    } else {
      for (const row of entries ?? []) {
        const personId = (row as { person_id?: string }).person_id
        if (!personId) continue
        const existing = statsByPersonId.get(personId)
        if (!existing) {
          statsByPersonId.set(personId, {
            count: 1,
            lastDate: (row as { date?: string | null }).date ?? (row as { created_at?: string }).created_at ?? null,
          })
        } else {
          existing.count += 1
        }
      }
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
      {peopleError && (
        <div
          role="alert"
          style={{
            padding: '1rem 1.25rem',
            background: 'rgba(220, 38, 38, 0.08)',
            color: '#991B1B',
            borderRadius: '12px',
            fontSize: '0.875rem',
            border: '1px solid rgba(220, 38, 38, 0.2)',
          }}
        >
          Couldn&apos;t load people: {peopleError.message}
        </div>
      )}

      {/* Page header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          gap: '1rem',
          flexWrap: 'wrap',
        }}
      >
        <div>
          <p
            style={{
              fontSize: '0.7rem',
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              color: '#747a84',
              marginBottom: '0.35rem',
              fontWeight: 500,
            }}
          >
            Your circle
          </p>
          <h1
            className="serif"
            style={{ fontSize: '2.75rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}
          >
            People
          </h1>
        </div>
        <AddPersonButton
          className="btn-primary"
          style={{ borderRadius: '50px', padding: '0.65rem 1.35rem', fontSize: '0.9rem' }}
        >
          + Add person
        </AddPersonButton>
      </div>

      {!peopleList?.length ? (
        <div
          className="card"
          style={{
            padding: '3.5rem 2.5rem',
            textAlign: 'center',
            maxWidth: '28rem',
            margin: '0 auto',
            background: 'rgba(255, 255, 255, 0.7)',
            border: '1px solid var(--card-border)',
            borderRadius: '16px',
            boxShadow: '0 4px 24px rgba(124, 58, 237, 0.06)',
          }}
        >
          <p
            className="serif"
            style={{
              fontSize: '2rem',
              color: 'var(--text-primary)',
              marginBottom: '0.75rem',
              lineHeight: 1.3,
            }}
          >
            Everyone you love lives here
          </p>
          <p
            style={{
              fontSize: '0.95rem',
              color: '#6B7280',
              marginBottom: '2rem',
              lineHeight: 1.6,
            }}
          >
            Add the people who matter most. Their page becomes a home for the stories, moments, and
            little things you notice about them.
          </p>
          <AddPersonButton
            className="btn-primary"
            style={{ borderRadius: '50px', padding: '0.75rem 1.75rem' }}
          >
            Add your first person
          </AddPersonButton>
        </div>
      ) : (
        <div className="peopleGrid">
          {peopleList.map((person) => {
            const stats = statsByPersonId.get(person.id) ?? { count: 0, lastDate: null }
            const entryCount = stats.count
            const last = stats.lastDate ? formatDayMonth(stats.lastDate) : ''
            const relColor = RELATIONSHIP_COLORS[person.relationship_type] ?? RELATIONSHIP_COLORS.other
            const relBg = RELATIONSHIP_BG[person.relationship_type] ?? RELATIONSHIP_BG.other

            return (
              <Link
                key={person.id}
                href={`/people/${person.id}`}
                style={{ textDecoration: 'none', display: 'block' }}
              >
                <div className="personCard">
                  <div className="topRow">
                    <div
                      className="avatar"
                      style={{
                        border: `2px solid ${relColor}`,
                        color: relColor,
                      }}
                      aria-hidden
                    >
                      {person.name?.[0]?.toUpperCase() ?? '?'}
                    </div>
                    <span className="relBadge" style={{ background: relBg, color: relColor }}>
                      {person.relationship_type}
                    </span>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <p className="name">{person.name}</p>
                    {person.birthday && (
                      <p className="birthday">
                        <span aria-hidden>📅</span>
                        {formatBirthday(person.birthday)}
                      </p>
                    )}
                  </div>

                  <div style={{ marginTop: 'auto' }}>
                    {entryCount === 0 ? (
                      <p className="noMoments">No moments yet</p>
                    ) : (
                      <p className="stats">
                        {entryCount} moment{entryCount === 1 ? '' : 's'}
                        {last ? ` · Last: ${last}` : ''}
                      </p>
                    )}
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}
