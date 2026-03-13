import ReminderForm from '@/components/reminders/ReminderForm'

export default function NewReminderPage() {
  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <p
          style={{
            fontSize: '0.7rem',
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            color: 'var(--muted)',
            marginBottom: '0.3rem',
          }}
        >
          New reminder
        </p>
        <h1
          className="serif"
          style={{ fontSize: '2.5rem', fontWeight: 700 }}
        >
          Create a reminder
        </h1>
      </div>
      <ReminderForm />
    </div>
  )
}
