export type RelationshipType = 'partner' | 'friend' | 'family' | 'colleague' | 'other'

export type EntryType = 'moment' | 'gift_given' | 'gift_received' | 'reminder_note'

export interface Person {
  id: string
  user_id: string
  name: string
  relationship_type: RelationshipType
  birthday?: string | null
  photo_url?: string | null
  notes?: string | null
  created_at: string
}

export interface Entry {
  id: string
  user_id: string
  person_id: string
  type: EntryType
  title: string
  body?: string | null
  date: string
  tags: string[]
  mood?: string | null
  created_at: string
  people?: Person
}

export interface Reminder {
  id: string
  user_id: string
  person_id: string
  entry_id?: string | null
  title: string
  remind_at: string
  repeat: 'none' | 'weekly' | 'monthly' | 'yearly'
  channel: 'email' | 'in_app' | 'both'
  is_sent: boolean
  created_at: string
  snoozed_until?: string | null
  deleted_at?: string | null
  people?: Person
}

/** Reminder with joined people and optional entry snippet (for list/calendar) */
export type ReminderWithDetails = Reminder & {
  people: Pick<Person, 'name' | 'relationship_type'> | null
  /** Joined via entry_id FK; Supabase may return object or array */
  entries?: Pick<Entry, 'id' | 'title' | 'body' | 'date'> | Pick<Entry, 'id' | 'title' | 'body' | 'date'>[] | null
  entry?: Pick<Entry, 'id' | 'title' | 'body' | 'date'> | null
}
