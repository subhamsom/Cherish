import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import EntryForm from '@/components/entries/EntryForm'
import { getEntryTypeBadgeStyle, getEntryTypeLabel } from '@/lib/entry-type-badges'

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
        <Link
          href={`/people/${(entry as any).people?.id}`}
          style={{ fontSize: '0.8rem', color: 'var(--muted)', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.3rem', marginBottom: '0.75rem' }}
        >
          ‹ {(entry as any).people?.name}
        </Link>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.75rem' }}>
          <span
            style={{
              fontSize: '0.65rem',
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              background: getEntryTypeBadgeStyle((entry as any).type).background,
              color: getEntryTypeBadgeStyle((entry as any).type).color,
              padding: '0.25rem 0.5rem',
              borderRadius: '6px',
            }}
          >
            {getEntryTypeLabel((entry as any).type)}
          </span>
        </div>
        <h1 className="serif" style={{ fontSize: '2.25rem', fontWeight: 700, marginTop: '0.5rem' }}>
          {entry.title}
        </h1>
      </div>
      <EntryForm entry={entry} />
    </div>
  )
}
