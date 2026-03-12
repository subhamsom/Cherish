import EntryForm from '@/components/entries/EntryForm'

export default async function NewEntryPage({
  searchParams,
}: {
  searchParams: Promise<{ person_id?: string }>
}) {
  const { person_id } = await searchParams

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <p style={{ fontSize: '0.7rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: '0.3rem' }}>New moment</p>
        <h1 className="serif" style={{ fontSize: '2rem', fontWeight: 600 }}>Capture a moment</h1>
      </div>
      <EntryForm defaultPersonId={person_id} />
    </div>
  )
}
