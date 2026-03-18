import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import PersonForm from '@/components/people/PersonForm'

export default async function EditPersonPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: person } = await supabase.from('people').select('*').eq('id', id).single()

  if (!person) notFound()

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
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
            Editing
          </p>
          <h1 className="serif" style={{ fontSize: '2.5rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
            {person.name}
          </h1>
          <Link
            href={`/people/${id}`}
            style={{
              fontSize: '0.85rem',
              color: 'var(--accent)',
              marginTop: '0.35rem',
              display: 'inline-block',
              textDecoration: 'none',
            }}
          >
            ← Back to profile
          </Link>
        </div>
      </div>
      <PersonForm person={person} />
    </div>
  )
}
