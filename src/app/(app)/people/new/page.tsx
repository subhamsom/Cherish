import PersonForm from '@/components/people/PersonForm'

export default function NewPersonPage() {
  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <p style={{ fontSize: '0.7rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: '0.3rem' }}>New person</p>
        <h1 className="serif" style={{ fontSize: '2.5rem', fontWeight: 700 }}>Add someone</h1>
      </div>
      <PersonForm />
    </div>
  )
}
