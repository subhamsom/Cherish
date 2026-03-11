import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import type { Person } from '@/types'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const [{ data: people }, { data: entries }] = await Promise.all([
    supabase.from('people').select('*').order('created_at', { ascending: false }),
    supabase.from('entries').select('*, people(name)').order('created_at', { ascending: false }).limit(4),
  ])

  const firstName = user?.user_metadata?.name?.split(' ')[0] || 'there'

  return (
    <div style={{ paddingBottom: '5rem' }}>
      {/* Header */}
      <div style={{ marginBottom: '2.5rem' }}>
        <p style={{ fontSize: '0.7rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: '0.4rem' }}>
          {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
        </p>
        <h1 className="serif" style={{ fontSize: '2.2rem', fontWeight: 300, color: 'var(--charcoal)' }}>
          Hello, {firstName}
        </h1>
      </div>

      {/* People section */}
      <section style={{ marginBottom: '3rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '1rem' }}>
          <h2 className="serif" style={{ fontSize: '1.3rem', fontWeight: 400, color: 'var(--charcoal)' }}>People</h2>
          <Link href="/people/new" style={{ fontSize: '0.75rem', color: 'var(--terracotta)', textDecoration: 'none' }}>+ Add person</Link>
        </div>

        {!people?.length ? (
          <div className="card" style={{ textAlign: 'center', padding: '2.5rem' }}>
            <p className="serif" style={{ fontSize: '1.2rem', color: 'var(--muted)', marginBottom: '1rem' }}>
              Who matters to you?
            </p>
            <Link href="/people/new">
              <button className="btn-primary">Add your first person</button>
            </Link>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '0.75rem' }}>
            {(people as Person[]).map((person) => (
              <Link key={person.id} href={`/people/${person.id}`} style={{ textDecoration: 'none' }}>
                <div className="card" style={{ textAlign: 'center', padding: '1.25rem', cursor: 'pointer', transition: 'transform 0.15s' }}>
                  <div style={{
                    width: '48px', height: '48px', borderRadius: '50%',
                    background: 'var(--dusty-rose)', margin: '0 auto 0.75rem',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '1.2rem', color: 'var(--terracotta)', fontWeight: 500,
                    fontFamily: 'Cormorant Garamond, serif',
                  }}>
                    {person.name[0].toUpperCase()}
                  </div>
                  <p style={{ fontSize: '0.875rem', color: 'var(--charcoal)', fontWeight: 400 }}>{person.name}</p>
                  <p style={{ fontSize: '0.7rem', color: 'var(--muted)', textTransform: 'capitalize', marginTop: '0.2rem' }}>
                    {person.relationship_type}
                  </p>
                </div>
              </Link>
            ))}
            <Link href="/people/new" style={{ textDecoration: 'none' }}>
              <div className="card" style={{ textAlign: 'center', padding: '1.25rem', cursor: 'pointer', border: '1px dashed var(--border)' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'var(--warm-white)', margin: '0 auto 0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem', color: 'var(--muted)' }}>+</div>
                <p style={{ fontSize: '0.8rem', color: 'var(--muted)' }}>Add person</p>
              </div>
            </Link>
          </div>
        )}
      </section>

      {/* Recent entries */}
      <section>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '1rem' }}>
          <h2 className="serif" style={{ fontSize: '1.3rem', fontWeight: 400, color: 'var(--charcoal)' }}>Recent moments</h2>
          <Link href="/entries/new" style={{ fontSize: '0.75rem', color: 'var(--terracotta)', textDecoration: 'none' }}>+ New entry</Link>
        </div>

        {!entries?.length ? (
          <div className="card" style={{ padding: '2rem' }}>
            <p style={{ color: 'var(--muted)', fontSize: '0.875rem', textAlign: 'center' }}>
              Add a person first, then capture your first moment with them.
            </p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {(entries as any[]).map((entry) => (
              <Link key={entry.id} href={`/entries/${entry.id}`} style={{ textDecoration: 'none' }}>
                <div className="card" style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start', cursor: 'pointer' }}>
                  <span style={{ fontSize: '0.65rem', letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--terracotta)', background: 'var(--warm-white)', padding: '0.2rem 0.5rem', borderRadius: '2px', whiteSpace: 'nowrap', marginTop: '0.15rem' }}>
                    {entry.type.replace('_', ' ')}
                  </span>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: '0.9rem', fontWeight: 400, color: 'var(--charcoal)', marginBottom: '0.2rem' }}>{entry.title}</p>
                    <p style={{ fontSize: '0.75rem', color: 'var(--muted)' }}>
                      {entry.people?.name} · {new Date(entry.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
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
