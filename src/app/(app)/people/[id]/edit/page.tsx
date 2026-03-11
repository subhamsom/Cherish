import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import PersonForm from '@/components/people/PersonForm'

export default async function EditPersonPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: person } = await supabase.from('people').select('*').eq('id', id).single()

  if (!person) notFound()

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <p style={{ fontSize: '0.7rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: '0.3rem' }}>Editing</p>
        <h1 className="serif" style={{ fontSize: '2rem', fontWeight: 600 }}>{person.name}</h1>
      </div>
      <PersonForm person={person} />
    </div>
  )
}
