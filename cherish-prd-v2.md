# Cherish — Product Requirements Document
**Version 2.0 | March 2026**

---

## 1. Vision & Purpose

Cherish is a warm, intimate app that helps people be more present and thoughtful in their relationships. It gives users a private space to remember the little things — stories someone shared, gifts exchanged, meaningful moments — so they never forget what matters to the people they love.

The app sits at the intersection of a personal journal, a relationship CRM, and an AI thoughtfulness coach.

**Core emotional promise:** *"Never forget what matters to the people who matter."*

**Core daily loop:** Something happens → open Cherish → tap "+" → select person → select type → write it down → save → optional reminder → done. Target: under 60 seconds for a simple capture.

---

## 2. Target Users

- People in relationships (romantic, friendship, family) who want to be more intentional
- Gift-givers who want their presents to feel personal, not generic
- Professionals with high-touch relationships — salespeople, consultants, community builders
- Anyone who has ever wished they'd remembered something someone told them

---

## 3. Design Principles

- **Warm & intimate** — feels like a private diary, not a productivity tool
- **Frictionless capture** — adding a note should take under 60 seconds
- **Trustworthy** — users are storing private relationship data; the app must feel safe and discreet
- **AI as a quiet assistant** — AI surfaces insights gently, never feels intrusive or robotic

---

## 4. Design System

- **Primary:** #7C3AED (purple)
- **Secondary accent:** #A78BFA (light lilac)
- **Background:** #FFFFFF (page) / #F9F8FF (cards)
- **Card border:** #E5E1FF
- **Text primary:** #1F1F1F
- **Text secondary:** #6B7280
- **Text muted:** ##747a84
- **Heading font:** Cormorant Garamond, weight 600–700, sized ~25% larger than equivalent Inter to compensate for optical size
- **Body font:** Inter, weight 400–500
- **Border radius:** 8–12px on cards, 50px on primary pill buttons
- **Relationship colors:** Partner → #F9A8D4 (pink), Friend → #93C5FD (blue), Family → #86EFAC (green), Colleague → #FCD34D (yellow), Other → #C4B5FD (lavender)

---

## 5. Tech Stack

| Layer | Tool |
|---|---|
| Framework | Next.js (App Router) |
| Database + Auth | Supabase (Postgres + Google OAuth) |
| AI | Anthropic Claude API (claude-sonnet-4-20250514) |
| Email | Resend |
| Hosting | Vercel (free tier) |
| Styling | Tailwind CSS |
| Icons | Lucide React |
| Fonts | Cormorant Garamond (headings) + Inter (body) |

All infrastructure runs on free tiers until meaningful user growth.

---

## 6. Database Schema

### people
| column | type | notes |
|--------|------|-------|
| id | uuid | primary key |
| user_id | uuid | FK → auth.users |
| name | text | required |
| relationship | text | Partner, Friend, Family, Colleague, Other |
| birthday | date | optional — auto-creates yearly reminder |
| photo_url | text | optional, Supabase Storage |
| notes | text | freetext bio / things to know about them |
| created_at | timestamp | |

### entries
| column | type | notes |
|--------|------|-------|
| id | uuid | primary key |
| user_id | uuid | FK → auth.users |
| person_id | uuid | FK → people |
| type | text | Moment, Gift Given, Gift Received, Note |
| title | text | required |
| details | text | optional |
| date | date | defaults to today |
| tags | text[] | optional |
| created_at | timestamp | |

### reminders
| column | type | notes |
|--------|------|-------|
| id | uuid | primary key |
| user_id | uuid | FK → auth.users |
| person_id | uuid | FK → people |
| entry_id | uuid | FK → entries, optional |
| title | text | |
| remind_on | date | |
| repeat | text | none, weekly, monthly, yearly |
| channel | text | email, in_app, both |
| sent | boolean | default false |
| created_at | timestamp | |

---

## 7. Pages / Routes

| Route | Page |
|---|---|
| `/` | Landing page (logged out) or redirect to /home (logged in) |
| `/login` | Sign in with Google |
| `/home` | Dashboard |
| `/people` | All people list |
| `/people/new` | Add new person |
| `/people/[id]` | Person profile page |
| `/people/[id]/edit` | Edit person |
| `/entries/new` | New entry form |
| `/entries/[id]` | View / edit single entry |
| `/reminders` | All reminders list |
| `/settings` | Account settings, notification preferences |
| `/privacy` | Privacy policy |
| `/terms` | Terms of service |

---

## 8. Phase 1 — Core Shell (Complete ✅)

- Google OAuth via Supabase ✅
- People CRUD ✅
- Entries CRUD (Moment, Gift Given, Gift Received, Note) ✅
- Row Level Security — users only see their own data ✅
- Dashboard home screen ✅
- UI revamp — lilac theme, Cormorant Garamond + Inter fonts ✅
- Sidebar navigation with sticky header ✅
- Google profile photo in sidebar ✅
- Notifications bell placeholder ✅
- Relationship color-coded avatar borders ✅
- Entry type badges (color-coded) ✅
- Entry description preview on home feed ✅
- Mobile floating action button (FAB) ✅

---

## 9. Phase 2 — Reminders & Core UX (Current)

### Reminders
- Reminder creation UI — title, linked person, date, repeat (none / weekly / monthly / yearly), channel (email / in-app / both)
- Reminders list page — filterable by person, mark done / snooze / delete
- Overdue reminders surfaced prominently on home dashboard
- Email reminders via Resend — warm personal-feeling email with reminder context
- In-app reminder display — notification badge + banner
- Reminder scheduling — Vercel cron job runs hourly, checks Supabase for due reminders, triggers Resend

### Home Dashboard
- Today's reminders section (overdue + due today)
- Recently added entries (last 3–4 across all people)
- Upcoming reminders (next 3)
- Daily contextual nudge — "You haven't logged anything about Mansi in 3 weeks"

### Entry Form UX
- Auto-suggest title placeholder based on selected type
- Date quick presets — "Today", "Yesterday", "Pick a date"
- Entry type icons (Sparkles → Moment, Gift → Gift Given/Received, FileText → Note)
- Remove mood/reaction field entirely
- Themed person dropdown (no system default styling)
- Inline "+ Add new person" link below person selector

### People Page
- Key stats on each person card — "12 moments · Last: Nov 23"

### General
- Profile button + sign out dropdown in sidebar
- Empty states — friendly prompts when no data yet
- Quick entry templates — pre-built starting points per type

---

## 10. Phase 3 — Profiles, AI & Enrichment

### People
- Person photo upload — compress via browser-image-compression before storing in Supabase Storage
- Full person profile page with timeline view of all entries
- Relationship health score — last entry date + days until next birthday

### AI Features (all on-demand, never automatic)

**A. Gift Suggestions**
Trigger: User taps "Suggest a gift" on a person's profile.
Claude receives all entries for that person + occasion + budget.
Returns 3–5 gift ideas with reasoning.

System prompt guidance:
- Prioritise gifts that are personal and specific — not generic picks
- Always suggest at least one experience (local class, day trip, workshop)
- Always suggest at least one handmade/personal option (custom illustration, photo book)
- Suggest local options where possible — local makers, small businesses
- Lean toward low-to-mid cost and high thoughtfulness over expensive and impersonal
- Never suggest gift cards, generic bouquets, or anything that could be for anyone

**B. Relationship Summary**
Trigger: User taps "Summarise" on a person's profile.
Claude returns a 3–5 sentence summary of who this person is and key things to remember.

System prompt guidance:
- Write like a thoughtful friend summarising observations — not a therapist, not a poet
- Tone: natural, grounded, human. No flowery language
- Stick to what the entries actually say — don't embellish
- Wrong tone: "Sarah is a radiant soul whose laughter fills every room..."
- Right tone: "Sarah is your closest friend from college. She's going through a career change and tends to appreciate practical support over advice. She loves hiking."

**C. Pattern Insights**
Trigger: User taps "What have I learned?" — only shows if 5+ entries exist for that person.
Claude identifies recurring interests, emotional patterns, and surfaces gentle suggestions.

**D. Smart Reminder Suggestions**
Trigger: After saving an entry.
If entry body contains future-oriented language ("she wants to", "he's thinking about", "next time"), Claude offers: "Would you like to set a reminder about this?"

**E. AI Memory Prompts**
Trigger: While writing an entry.
Claude suggests a follow-up question to help capture richer detail.

### Other Phase 3
- Voice-to-text input — mic button using browser Web Speech API (free)
- Tag chips — visual token chips replacing comma-separated tags
- Themed date picker — react-day-picker styled in lilac
- Sticky Save button on mobile
- PWA setup — manifest.json, next-pwa, offline support, iOS home screen install prompt

---

## 11. Phase 4 — Insights & Discovery

- "On this day" memory resurface — show a past memory from the same date in previous years
- Insights page — most logged person, most common entry type, streaks
- Streak / consistency tracker — habit loop
- AI-powered search — natural language search (requires Supabase pgvector + Claude API)
- Conversational AI companion — chat with AI about your relationships (high complexity, Phase 4+)

---

## 12. Feature Backlog

| # | Feature | Priority | Phase | Complexity | Cost |
|---|---------|----------|-------|------------|------|
| 1 | Upcoming dates dashboard | 🔴 High | 2 | Low | 💚 Free |
| 2 | Email reminders via Resend | 🔴 High | 2 | Medium | 💚 Free tier |
| 3 | Daily contextual nudge | 🔴 High | 2 | Low | 💚 Free |
| 4 | Quick entry templates | 🔴 High | 2 | Low | 💚 Free |
| 5 | Key stats on people cards | 🔴 High | 2 | Low | 💚 Free |
| 6 | Profile button + sign out | 🔴 High | 2 | Low | 💚 Free |
| 7 | Empty states | 🔴 High | 2 | Low | 💚 Free |
| 8 | Person photo upload | 🟡 Medium | 3 | Medium | ⚠️ Supabase Storage |
| 9 | Person profile + timeline | 🟡 Medium | 3 | Low | 💚 Free |
| 10 | AI gift suggestions | 🔴 High | 3 | Medium | 💛 Low cost |
| 11 | AI relationship summary | 🔴 High | 3 | Medium | 💛 Low cost |
| 12 | AI pattern insights | 🟡 Medium | 3 | Medium | 💛 Low cost |
| 13 | Smart reminder suggestions | 🟡 Medium | 3 | Medium | 💛 Low cost |
| 14 | AI memory prompts | 🔴 High | 3 | Medium | 💛 Low cost |
| 15 | Voice-to-text input | 🟡 Medium | 3 | Low | 💚 Free |
| 16 | Relationship health score | 🔴 High | 3 | Low | 💚 Free |
| 17 | Tag chips | 🟡 Medium | 3 | Medium | 💚 Free |
| 18 | Themed date picker | 🟡 Medium | 3 | Medium | 💚 Free |
| 19 | PWA conversion | 🔴 High | 3 | Medium | 💚 Free |
| 20 | "On this day" resurface | 🟡 Medium | 4 | Low | 💚 Free |
| 21 | Insights page | 🟢 Low | 4 | Medium | 💚 Free |
| 22 | Streak tracker | 🟢 Low | 4 | Low | 💚 Free |
| 23 | AI-powered search | 🟡 Medium | 4 | High | 🔴 Medium cost |
| 24 | Conversational AI companion | 🟢 Low | 4+ | High | 🔴 Higher cost |

---

## 13. Monetization Strategy

**Now:** "Support Cherish" link (Buy Me a Coffee or Stripe one-time) — visible but not pushy.

**Phase 3+:** Freemium model
- **Free tier:** Up to 5 people, unlimited entries, basic reminders
- **Paid tier (~$5–8/month):** Unlimited people, AI features, voice input, insights, export

Do not build paywalls until there is meaningful user feedback confirming willingness to pay.

---

## 14. Platform Strategy

**Current:** Web app (desktop + mobile browser)
**Phase 3:** Convert to PWA — installable on home screen, push notifications, offline support. No App Store required.
**Phase 4+:** Evaluate native iOS/Android only if PWA proves insufficient.

---

## 15. Trust & Legal Pages

- `/privacy` — Privacy policy (data stored privately, encrypted, never sold)
- `/terms` — Terms of service
- Both pages required before any public launch or LinkedIn share

---

## 16. Cursor Implementation Notes

- Always use Supabase Row Level Security on every table
- Use `@supabase/ssr` for session management in Next.js
- All Claude API calls must be server-side (Next.js API routes or Server Actions) — never expose API key to browser
- Reminder scheduling: Vercel cron job runs hourly, queries Supabase for reminders where remind_on <= now and sent = false, triggers Resend, marks sent = true
- Use Resend for email delivery — simple Node.js SDK
- Design mobile-first — most users will access on phone

---

## 17. Out of Scope

- Native iOS / Android app
- Social or sharing features
- Third-party calendar sync
- Team / shared accounts
- Public profiles
- Importing contacts from phone

---

*Last updated: March 2026*
