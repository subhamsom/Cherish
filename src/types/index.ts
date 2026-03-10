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
  people?: Person
}
