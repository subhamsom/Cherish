import Link from 'next/link'
import RemindersList from '@/components/reminders/RemindersList'

export default function RemindersPage() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          gap: '0.75rem',
          flexWrap: 'wrap',
        }}
      >
        <div>
          <p
            style={{
              fontSize: '0.7rem',
              letterSpacing: '0.16em',
              textTransform: 'uppercase',
              color: '#747a84',
              marginBottom: '0.25rem',
            }}
          >
            Don’t forget
          </p>
          <h1
            className="serif"
            style={{ fontSize: '2.5rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}
          >
            Reminders
          </h1>
        </div>
        <Link href="/reminders/new">
          <button
            className="btn-primary"
            style={{ borderRadius: '50px' }}
          >
            New reminder
          </button>
        </Link>
      </div>

      <RemindersList />
    </div>
  )
}
