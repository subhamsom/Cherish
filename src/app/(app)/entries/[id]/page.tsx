import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import EntryForm from '@/components/entries/EntryForm'

const ENTRY_TYPE_LABELS: Record<string, string> = {
  moment: 'Moment', gift_given: 'Gift given', gift_received: 'Gift received', reminder_note: 'Note',
}

export default async function EntryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: entry } = await supabase
    .from('entries')
    .select('*, people(id, name)')
    .eq('id', id)
    .single()

  if (!entry) notFound()

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <Link href={`/people/${entry.people?.id}`} style={{ fontSize: '0.8rem', color: 'var(--muted)', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.3rem', marginBottom: '0.75rem' }}>
          ‹ {entry.people?.name}
        </Link>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.75rem' }}>
          <span style={{ fontSize: '0.65rem', letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--terracotta)', background: 'var(--warm-white)', padding: '0.2rem 0.5rem', borderRadius: '2px' }}>
            {ENTRY_TYPE_LABELS[entry.type]}
          </span>
        </div>
        <h1 className="serif" style={{ fontSize: '1.8rem', fontWeight: 300, marginTop: '0.5rem' }}>{entry.title}</h1>
      </div>
      <EntryForm entry={entry} />
    </div>
  )
}
