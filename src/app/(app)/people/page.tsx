import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import type { Person } from '@/types'

export default async function PeoplePage() {
  const supabase = await createClient()
  const { data: people } = await supabase.from('people').select('*').order('name')

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '2rem' }}>
        <div>
          <p style={{ fontSize: '0.7rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: '0.3rem' }}>Your circle</p>
          <h1 className="serif" style={{ fontSize: '2rem', fontWeight: 300 }}>People</h1>
        </div>
        <Link href="/people/new">
          <button className="btn-primary">+ Add person</button>
        </Link>
      </div>

      {!people?.length ? (
        <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
          <p className="serif" style={{ fontSize: '1.4rem', color: 'var(--muted)', marginBottom: '1rem' }}>
            Everyone you love lives here.
          </p>
          <p style={{ fontSize: '0.875rem', color: 'var(--muted)', marginBottom: '1.5rem' }}>
            Add someone to start remembering what matters to them.
          </p>
          <Link href="/people/new">
            <button className="btn-primary">Add your first person</button>
          </Link>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {(people as Person[]).map((person) => (
            <Link key={person.id} href={`/people/${person.id}`} style={{ textDecoration: 'none' }}>
              <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem', cursor: 'pointer', padding: '1rem 1.25rem' }}>
                <div style={{
                  width: '40px', height: '40px', borderRadius: '50%',
                  background: 'var(--dusty-rose)', flexShrink: 0,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '1.1rem', color: 'var(--terracotta)',
                  fontFamily: 'Cormorant Garamond, serif', fontWeight: 500,
                }}>
                  {person.name[0].toUpperCase()}
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: '0.9rem', fontWeight: 400, color: 'var(--charcoal)' }}>{person.name}</p>
                  <p style={{ fontSize: '0.75rem', color: 'var(--muted)', textTransform: 'capitalize' }}>{person.relationship_type}</p>
                </div>
                {person.birthday && (
                  <p style={{ fontSize: '0.7rem', color: 'var(--muted)' }}>
                    🎂 {new Date(person.birthday + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </p>
                )}
                <span style={{ color: 'var(--muted)', fontSize: '0.9rem' }}>›</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
