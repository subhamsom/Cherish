import PersonForm from '@/components/people/PersonForm'

export default function NewPersonPage() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
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
        <h1 className="serif" style={{ fontSize: '2.5rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
          Add someone
        </h1>
        <p style={{ fontSize: '0.9rem', color: '#6B7280', marginTop: '0.5rem', maxWidth: '28rem' }}>
          A place for the little things you notice about them.
        </p>
      </div>
      <PersonForm />
    </div>
  )
}
