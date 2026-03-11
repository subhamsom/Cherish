# Cherish — Product Requirements Document
### A relationship memory & gifting companion app
**Version:** 1.0 (MVP)  
**Stack:** Next.js · Supabase · Claude API · Resend · Vercel  
**Target:** Public web app (PWA — installable on iPhone & Android)

---

## 1. Vision & Purpose

Cherish is a warm, intimate app that helps people be more present and thoughtful in their relationships. It gives users a private space to remember the little things — stories someone shared, gifts exchanged, meaningful moments — so they never forget what matters to the people they love.

The app sits at the intersection of a personal journal, a relationship CRM, and an AI thoughtfulness coach.

**Core emotional promise:** *"Never forget what matters to the people who matter."*

---

## 2. Target User

- People in relationships (romantic, friendship, family) who want to be more intentional
- Gift-givers who want their presents to feel personal, not generic
- Anyone who has ever wished they'd remembered something someone told them

---

## 3. Design Principles

- **Warm & intimate** — feels like a private diary, not a productivity tool
- **Frictionless capture** — adding a note should take under 10 seconds
- **Trustworthy** — users are storing private relationship data; the app must feel safe and discreet
- **AI as a quiet assistant** — AI surfaces insights gently, never feels intrusive or robotic

### Visual Direction (for Cursor/UI implementation)
- Tone: Warm, intimate, soft — think candlelight, handwritten letters, linen textures
- Color palette: Warm neutrals (cream, warm whites, dusty rose, terracotta accents) with deep charcoal text
- Typography: A distinctive serif or soft humanist typeface for headings; clean readable body font
- Avoid: Cold blues, harsh whites, generic "SaaS" design patterns, purple gradients
- Motion: Gentle, unhurried transitions — like turning pages, not snapping between screens

---

## 4. Tech Stack

| Layer | Tool | Why |
|---|---|---|
| Framework | Next.js (App Router) | PWA support, easy deployment |
| Database + Auth | Supabase | Auth, Postgres DB, row-level security |
| AI | Claude API (claude-sonnet-4-20250514) | Suggestions, summaries, analysis |
| Email reminders | Resend | Simple transactional email |
| In-app notifications | Supabase + polling or Supabase Realtime | Lightweight for v1 |
| Hosting | Vercel | Free tier, instant deploys |
| PWA | next-pwa | Makes it installable on iOS/Android |

---

## 5. Data Model

### `users`
- id, email, name, created_at
- (Handled by Supabase Auth)

### `people`
- id, user_id (FK), name, relationship_type (partner / friend / family / colleague / other), birthday (optional), photo_url (optional), notes (freetext bio), created_at

### `entries`
- id, user_id (FK), person_id (FK), type (moment / gift_given / gift_received / reminder_note), title, body, date, tags (array), mood (optional emoji/label), created_at

### `reminders`
- id, user_id (FK), person_id (FK), entry_id (FK, optional), title, remind_at (timestamp), repeat (none / weekly / monthly / yearly), channel (email / in_app / both), is_sent, created_at

---

## 6. Features

### 6.1 Authentication
- Email/password signup and login via Supabase Auth
- "Remember me" session persistence
- Password reset via email
- Each user's data is completely private (Supabase Row Level Security)

---

### 6.2 People Profiles
The foundational object — every note, gift, and reminder belongs to a person.

**Create/Edit a Person:**
- Name (required)
- Relationship type (partner, friend, family, colleague, other)
- Birthday (optional — auto-creates a yearly reminder)
- Photo (optional upload)
- A short bio/notes field ("things to know about them")

**Person Profile Page shows:**
- Recent entries (moments, gifts)
- Upcoming reminders for this person
- AI Summary card (see 6.5)
- Quick-add button

---

### 6.3 Entries — Notes & Moments
Capture anything meaningful about a person.

**Entry Types:**
1. **Moment** — A story they shared, something funny they said, a memory together
2. **Gift Given** — A gift you gave them (name, occasion, date, how they reacted)
3. **Gift Received** — A gift they gave you (name, occasion, date, feelings associated)
4. **Reminder Note** — A note tied to a future reminder ("She mentioned wanting to try pottery")

**Entry Fields:**
- Title (short, required)
- Body (longer description, optional)
- Date (defaults to today)
- Tags (user-defined, e.g. "birthday", "food", "travel")
- Mood/reaction (optional — simple emoji picker)
- Linked reminder (optional — set a follow-up reminder from this entry)

**Quick-add flow:**
- Tap "+" → choose person → choose type → fill title + body → save
- Target: under 10 seconds for a simple capture

---

### 6.4 Reminders
Never forget to follow up on what matters.

**Creating a Reminder:**
- Title ("Ask about her pottery class")
- Linked person
- Date & time
- Repeat: None / Weekly / Monthly / Yearly
- Channel: Email / In-app / Both

**Reminder delivery:**
- **Email** via Resend — sends a warm, personal-feeling email with the reminder context
- **In-app** — shows as a notification badge + banner when user opens app

**Reminder management:**
- List view of all upcoming reminders (filterable by person)
- Mark as done / snooze / delete
- Overdue reminders are surfaced prominently

---

### 6.5 AI Features (Claude API)

All AI features are on-demand (user taps a button) — never automatic or pushy.

#### A. Gift Suggestions
*Trigger: User taps "Suggest a gift" on a person's profile*

Claude receives:
- All gift_given entries for this person (past gifts)
- All gift_received entries (what they've given you — signals taste)
- Any moments/notes tagged with interests, desires, or reactions
- Occasion (user inputs: birthday, anniversary, just because, etc.)
- Budget range (optional)
- User's city/location (from profile settings, used to ground local suggestions)

Claude returns:
- 3–5 gift ideas with reasoning ("Based on her love of travel you've noted, and the pottery class she mentioned...")
- Each suggestion has a title, description, and why it fits

**AI system prompt guidance for gift suggestions:**
- Prioritise gifts that are personal, specific, and rooted in what you know about this person — not generic Amazon-style picks
- Always consider and suggest at least one **experience** (a local class, a day trip, a dinner at a place tied to their interests, a workshop)
- Always consider at least one **handmade or personal** option (a custom illustration, a handwritten letter, a photo book, something made with care)
- Suggest **local options** where possible — neighbourhood spots, local makers, small businesses — not just online retailers
- Lean toward **low-to-mid cost and high thoughtfulness** over expensive and impersonal
- If budget is unspecified, default to thoughtful over lavish
- Never suggest gift cards, generic bouquets, or anything that could be for anyone

#### B. Relationship Summary
*Trigger: User taps "Summarise" on a person's profile*

Claude receives all entries for that person and returns a 3–5 sentence summary: who this person is to the user, key things to remember, patterns in the relationship.

**AI system prompt guidance for relationship summary:**
- Write like a thoughtful friend summarising what they've observed — not a therapist, not a poet
- Tone should be natural, grounded, and human. No flowery language, no over-the-top warmth
- Stick to what the entries actually say — don't embellish or project emotions that aren't there
- If there isn't much data yet, say so plainly and encourage the user to keep adding notes
- Example of wrong tone: *"Sarah is a radiant soul whose laughter fills every room..."*
- Example of right tone: *"Sarah is your closest friend from college. She's going through a career change right now and tends to appreciate practical support over advice. She loves hiking and has been talking about doing the Hampta Pass trek."*

#### C. Pattern Insights
*Trigger: User taps "What have I learned?" on a person's profile (only shows if 5+ entries exist)*

Claude identifies patterns across entries:
- Recurring interests, topics, or passions
- Emotional patterns ("She lights up when you mention travel")
- Gentle suggestions ("You haven't noted a moment with her in 3 weeks — maybe reach out?")

#### D. Smart Reminder Suggestions
*Trigger: After saving an entry*

If the entry body contains future-oriented language ("she wants to", "he's thinking about", "next time"), Claude offers: "Would you like to set a reminder about this?"

---

### 6.6 Dashboard / Home Screen
The first thing users see when they open the app.

**Sections:**
- **Today's Reminders** — any reminders due today or overdue
- **Recently Added** — last 3–4 entries across all people
- **People** — cards for each person (photo/initial, name, last entry date)
- **Upcoming** — next 3 reminders in the future

---

## 7. User Flows

### New User Onboarding
1. Sign up with email
2. Short welcome screen explaining what Cherish is (3 slides max)
3. "Add your first person" prompt
4. Create first person → prompted to add first entry
5. Land on home dashboard

### Core Daily Loop
1. Something happens → open Cherish → tap "+"
2. Select person → select type → write it down → save
3. Optional: set a reminder from that entry
4. Done — back to their day in under 60 seconds

### Gift Planning Flow
1. Tap person → "Suggest a gift"
2. Select occasion + budget (optional)
3. AI generates suggestions
4. User saves a favourite as a note or sets a reminder to buy it

---

## 8. Pages / Routes

| Route | Page |
|---|---|
| `/` | Landing page (logged out) or Dashboard (logged in) |
| `/login` | Login & Sign up (single combined screen — toggle between the two) |
| `/dashboard` | Home dashboard |
| `/people` | All people list |
| `/people/new` | Add new person |
| `/people/[id]` | Person profile page |
| `/people/[id]/edit` | Edit person |
| `/entries/new` | Quick-add entry (person pre-selected if from profile) |
| `/entries/[id]` | View/edit a single entry |
| `/reminders` | All reminders list |
| `/settings` | Account settings, notification preferences |

---

## 9. PWA Configuration

- Add `manifest.json` with app name "Cherish", icons, theme color (warm cream/terracotta)
- Configure `next-pwa` for service worker and offline support
- `apple-mobile-web-app-capable` meta tags for iOS home screen install
- Add "Install App" prompt for first-time mobile visitors

---

## 10. MVP Scope (Build This First)

The following is the v1 build order — do not build everything at once:

**Phase 1 — Core Shell**
- [ ] Auth (signup, login, logout)
- [ ] People CRUD (create, view, edit, delete)
- [ ] Entries CRUD (all 4 types)
- [ ] Dashboard home screen

**Phase 2 — Reminders**
- [ ] Reminder creation + management UI
- [ ] In-app reminder display
- [ ] Email reminders via Resend

**Phase 3 — AI**
- [ ] Gift suggestions
- [ ] Relationship summary
- [ ] Pattern insights
- [ ] Smart reminder suggestions on entry save

**Phase 4 — Polish**
- [ ] PWA setup + mobile install prompt
- [ ] Onboarding flow
- [ ] Empty states (friendly prompts when no data yet)
- [ ] Loading states and error handling

---

## 11. Out of Scope for v1

- Social/sharing features (sharing a person's profile with someone else)
- Native iOS/Android app (PWA covers this for v1)
- Importing contacts from phone
- Photo attachments on entries (keep it text-first for v1)
- Push notifications (email + in-app is enough for v1)
- Recurring entries / journaling streaks

---

## 12. Cursor Prompting Notes

When building this in Cursor:

- Always use **Supabase Row Level Security** on every table — users must only see their own data
- Use **Supabase Auth helpers for Next.js** (`@supabase/ssr`) for session management
- The Claude API call for gift suggestions should pass a **system prompt** establishing a warm, thoughtful tone — not a robotic list-maker
- Use **Resend** for email delivery — it has a simple Node.js SDK
- For **reminder scheduling**, use a Supabase Edge Function with pg_cron OR a simple Vercel cron job that runs every hour and checks for due reminders
- Keep the **AI calls server-side** (Next.js API routes or Server Actions) — never expose the Claude API key to the browser
- Design with **mobile-first** since most users will access on phone

---

*Built with Cherish. Remember what matters.*
