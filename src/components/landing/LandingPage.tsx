'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Users, Sparkles, Heart } from 'lucide-react'

const PAGE_BG = {
  backgroundColor: '#FEFCFF',
  backgroundImage:
    'radial-gradient(ellipse 600px 500px at 15% 20%, rgba(196, 181, 253, 0.4) 0%, transparent 70%), radial-gradient(ellipse 400px 600px at 80% 10%, rgba(249, 168, 212, 0.3) 0%, transparent 70%), radial-gradient(ellipse 500px 400px at 60% 55%, rgba(221, 214, 254, 0.25) 0%, transparent 70%), radial-gradient(ellipse 350px 450px at 25% 75%, rgba(253, 242, 248, 0.4) 0%, transparent 70%), radial-gradient(ellipse 450px 350px at 88% 80%, rgba(249, 168, 212, 0.2) 0%, transparent 70%), radial-gradient(ellipse 300px 300px at 45% 30%, rgba(255, 255, 255, 0.7) 0%, transparent 60%)',
}

const cardStyle = {
  background: 'rgba(255,255,255,0.85)',
  backdropFilter: 'blur(12px)',
  WebkitBackdropFilter: 'blur(12px)',
  border: '1px solid rgba(124, 58, 237, 0.1)',
}

export default function LandingPage() {
  return (
    <main
      className="min-h-screen flex flex-col"
      style={PAGE_BG}
    >
      {/* ——— NAVBAR ——— */}
      <nav className="flex justify-between items-center w-full px-6 py-6 md:px-12 md:py-6">
        <span
          className="font-semibold"
          style={{
            fontFamily: 'var(--font-heading)',
            fontSize: '32px',
            color: '#7C3AED',
            letterSpacing: '-0.01em',
          }}
        >
          Cherish
        </span>
        <Link
          href="/login"
          className="text-sm font-medium"
          style={{ fontFamily: 'var(--font-body)', color: '#947BAD' }}
        >
          Sign in →
        </Link>
      </nav>

      {/* ——— HERO ——— */}
      <section className="relative min-h-[calc(100vh-80px)] flex flex-col items-center justify-center px-4 overflow-hidden">
        <div className="max-w-[600px] w-full flex flex-col items-center text-center">
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="uppercase mb-4"
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: '11px',
              letterSpacing: '0.15em',
              color: '#A78BFA',
            }}
          >
            YOUR RELATIONSHIP MEMORY COMPANION
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="leading-tight mb-5"
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: 'clamp(2.25rem, 5vw, 4rem)',
              fontWeight: 600,
              color: '#2D1B69',
            }}
          >
            Never forget what matters
            <br />
            <em style={{ fontStyle: 'italic', color: '#7C3AED' }}>
              to the people who matter.
            </em>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="max-w-[460px] mb-5"
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: '18px',
              color: '#6B5B8E',
              lineHeight: 1.7,
            }}
          >
            A private space to remember the little things — stories shared, gifts
            exchanged, moments that meant something.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mb-5"
          >
            <Link href="/login">
              <motion.button
                type="button"
                className="rounded-[50px] border-0 font-medium text-white cursor-pointer"
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '16px',
                  padding: '16px 36px',
                  background: '#7C3AED',
                  boxShadow: '0 8px 32px rgba(124, 58, 237, 0.25)',
                }}
                whileHover={{
                  scale: 1.02,
                  boxShadow: '0 12px 40px rgba(124, 58, 237, 0.35)',
                }}
                whileTap={{ scale: 0.98 }}
              >
                Start remembering
              </motion.button>
            </Link>
          </motion.div>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: '13px',
              color: '#947BAD',
            }}
          >
            No credit card. Just more thoughtful relationships.
          </motion.p>
        </div>

        {/* Floating cards — only >= 1200px; rotation on outer div, float on inner motion.div */}
        <div className="hidden min-[1200px]:block absolute inset-0 pointer-events-none">
          {/* Card 1 — Rohan / Moment */}
          <div
            style={{
              position: 'absolute',
              left: '10%',
              top: '38%',
              transform: 'rotate(-14deg)',
              zIndex: 10,
            }}
          >
            <motion.div
              className="w-[220px] p-4 rounded-2xl"
              style={{
                ...cardStyle,
                boxShadow: '0 8px 32px rgba(124, 58, 237, 0.12)',
              }}
              animate={{ y: [0, -12, 0] }}
              transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
            >
              <span
                className="inline-flex items-center gap-1.5 text-xs font-semibold rounded-full px-2 py-0.5"
                style={{
                  fontFamily: 'var(--font-heading)',
                  color: '#7C3AED',
                  background: 'rgba(139, 92, 246, 0.12)',
                }}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-[#7C3AED]" />
                Moment
              </span>
              <p
                className="mt-2 text-sm"
                style={{ fontFamily: 'var(--font-body)', color: '#2D1B69' }}
              >
                Rohan mentioned he&apos;s been stressed about his new job. Check in
                next week.
              </p>
              <div
                className="mt-2 w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-medium"
                style={{ background: '#7C3AED' }}
              >
                R
              </div>
            </motion.div>
          </div>
          {/* Card 2 — Mansi / Gift Given */}
          <div
            style={{
              position: 'absolute',
              right: '6%',
              top: '18%',
              transform: 'rotate(6deg)',
              zIndex: 10,
            }}
          >
            <motion.div
              className="w-[220px] p-4 rounded-2xl"
              style={{
                ...cardStyle,
                boxShadow: '0 8px 32px rgba(124, 58, 237, 0.12)',
              }}
              animate={{ y: [0, -12, 0] }}
              transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
            >
              <span
                className="inline-flex items-center gap-1.5 text-xs font-semibold rounded-full px-2 py-0.5"
                style={{
                  fontFamily: 'var(--font-heading)',
                  color: '#DB2777',
                  background: 'rgba(249, 168, 212, 0.2)',
                }}
              >
                <span
                  className="w-1.5 h-1.5 rounded-full"
                  style={{ background: '#DB2777' }}
                />
                Gift Given
              </span>
              <p
                className="mt-2 text-sm"
                style={{ fontFamily: 'var(--font-body)', color: '#2D1B69' }}
              >
                Gifted Mansi the book she mentioned 3 months ago. She cried.
              </p>
              <div
                className="mt-2 w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium"
                style={{ background: '#F9A8D4', color: '#9D174D' }}
              >
                M
              </div>
            </motion.div>
          </div>
          {/* Card 3 — Priya / Reminder */}
          <div
            style={{
              position: 'absolute',
              right: '12%',
              bottom: '18%',
              transform: 'rotate(16deg)',
              zIndex: 10,
            }}
          >
            <motion.div
              className="w-[220px] p-4 rounded-2xl"
              style={{
                ...cardStyle,
                boxShadow: '0 8px 32px rgba(124, 58, 237, 0.12)',
              }}
              animate={{ y: [0, -12, 0] }}
              transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
            >
              <span
                className="inline-flex items-center gap-1.5 text-xs font-semibold rounded-full px-2 py-0.5"
                style={{
                  fontFamily: 'var(--font-heading)',
                  color: '#059669',
                  background: 'rgba(110, 231, 183, 0.2)',
                }}
              >
                <span
                  className="w-1.5 h-1.5 rounded-full"
                  style={{ background: '#059669' }}
                />
                Reminder
              </span>
              <p
                className="mt-2 text-sm"
                style={{ fontFamily: 'var(--font-body)', color: '#2D1B69' }}
              >
                Priya&apos;s birthday is in 3 days — she loves handwritten notes
              </p>
              <div
                className="mt-2 w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold"
                style={{ fontFamily: 'var(--font-body)', background: '#6EE7B7', color: '#065F46' }}
              >
                P
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ——— SECTION 2: EMOTIONAL HOOK ——— */}
      <section className="py-12 md:py-20 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto text-center">
          <motion.h2
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-5xl font-semibold mb-4"
            style={{ fontFamily: 'var(--font-heading)', color: '#2D1B69' }}
          >
            We forget. Not because we don&apos;t care.
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.08 }}
            className="text-lg mb-12"
            style={{ fontFamily: 'var(--font-body)', color: '#6B5B8E' }}
          >
            Because life moves fast. Cherish helps you slow down.
          </motion.p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              { emoji: '🎂', text: 'Forgot their birthday. Again.' },
              { emoji: '🎁', text: 'Bought a generic gift. Again.' },
              { emoji: '💬', text: 'What was that thing they mentioned?' },
            ].map((item, i) => (
              <motion.div
                key={item.text}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                whileHover={{ y: -4, boxShadow: '0 12px 40px rgba(124, 58, 237, 0.15)' }}
                className="p-6 rounded-2xl text-center"
                style={{
                  background: '#fff',
                  border: '1px solid rgba(124, 58, 237, 0.12)',
                  borderRadius: '16px',
                  boxShadow: '0 4px 24px rgba(124, 58, 237, 0.08)',
                }}
              >
                <span className="text-4xl block mb-3">{item.emoji}</span>
                <p
                  className="font-bold text-base"
                  style={{
                    fontFamily: 'var(--font-body)',
                    color: '#2D1B69',
                  }}
                >
                  {item.text}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ——— SECTION 3: HOW IT WORKS ——— */}
      <section className="py-12 md:py-20 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="uppercase mb-2"
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: '11px',
              letterSpacing: '0.15em',
              color: '#A78BFA',
            }}
          >
            HOW IT WORKS
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-[2.75rem] font-semibold mb-12"
            style={{ fontFamily: 'var(--font-heading)', color: '#2D1B69' }}
          >
            60 seconds to capture. A lifetime to cherish.
          </motion.h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {[
              {
                num: '01',
                icon: Users,
                title: 'Add someone you love',
                desc: 'Create a space for each person who matters.',
              },
              {
                num: '02',
                icon: Sparkles,
                title: 'Capture moments as they happen',
                desc: 'Log stories, gifts, and little details in under a minute.',
              },
              {
                num: '03',
                icon: Heart,
                title: 'Never show up empty-handed',
                desc: 'Reminders and gift ideas based on what you actually know.',
              },
            ].map((step, i) => (
              <motion.div
                key={step.num}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className="p-6 rounded-2xl"
                style={{
                  ...cardStyle,
                  borderRadius: '16px',
                  boxShadow: '0 4px 24px rgba(124, 58, 237, 0.08)',
                }}
              >
                <span
                  className="text-4xl font-bold block mb-3"
                  style={{ fontFamily: 'var(--font-heading)', color: '#A78BFA' }}
                >
                  {step.num}
                </span>
                <step.icon
                  className="w-8 h-8 mb-3"
                  style={{ color: '#7C3AED' }}
                  strokeWidth={2}
                />
                <h3
                  className="text-xl font-semibold mb-2"
                  style={{ fontFamily: 'var(--font-heading)', color: '#2D1B69' }}
                >
                  {step.title}
                </h3>
                <p
                  style={{
                    fontFamily: 'var(--font-body)',
                    color: '#6B5B8E',
                    fontSize: '0.95rem',
                  }}
                >
                  {step.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ——— SECTION 4: FEATURES ——— */}
      <section className="py-12 md:py-20 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="uppercase mb-2"
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: '11px',
              letterSpacing: '0.15em',
              color: '#A78BFA',
            }}
          >
            WHAT CHERISH DOES
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-[2.75rem] font-semibold mb-12"
            style={{ fontFamily: 'var(--font-heading)', color: '#2D1B69' }}
          >
            Your private relationship journal
          </motion.h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {[
              {
                icon: '💜',
                title: 'Memory capture',
                desc: 'Log moments in under 60 seconds. Voice, text, whatever works.',
              },
              {
                icon: '🎁',
                title: 'Gift suggestions',
                desc: 'AI-powered gift ideas based on what you actually know about them.',
              },
              {
                icon: '🔔',
                title: 'Thoughtful reminders',
                desc: 'Never miss a birthday, follow-up, or meaningful moment.',
              },
              {
                icon: '✨',
                title: 'Relationship insights',
                desc: 'Discover patterns. Understand people better over time.',
              },
            ].map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: (i % 2) * 0.1 }}
                className="p-6 rounded-2xl"
                style={{
                  ...cardStyle,
                  borderRadius: '16px',
                  boxShadow: '0 4px 24px rgba(124, 58, 237, 0.08)',
                }}
              >
                <span className="text-2xl">{f.icon}</span>
                <h3
                  className="text-lg font-semibold mt-2 mb-2"
                  style={{ fontFamily: 'var(--font-heading)', color: '#2D1B69' }}
                >
                  {f.title}
                </h3>
                <p
                  style={{
                    fontFamily: 'var(--font-body)',
                    color: '#6B5B8E',
                    fontSize: '0.9rem',
                  }}
                >
                  {f.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ——— SECTION 5: CLOSING CTA (floating card) ——— */}
      <section className="py-12 md:py-20 px-4 sm:px-6 flex justify-center">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="w-full max-w-[640px] rounded-3xl p-8 md:p-16 text-center"
          style={{
            background: '#fff',
            borderRadius: '24px',
            boxShadow: '0 20px 60px rgba(124, 58, 237, 0.15)',
          }}
        >
          <h2
            className="text-3xl md:text-5xl font-semibold mb-4"
            style={{ fontFamily: 'var(--font-heading)', color: '#2D1B69' }}
          >
            The little things are the big things.
          </h2>
          <p
            className="text-lg mb-8"
            style={{ fontFamily: 'var(--font-body)', color: '#6B5B8E' }}
          >
            Start remembering the people who matter most.
          </p>
          <Link href="/login">
            <motion.button
              type="button"
              className="rounded-[50px] border-0 font-medium text-white cursor-pointer"
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: '16px',
                padding: '16px 36px',
                background: '#7C3AED',
                boxShadow: '0 8px 32px rgba(124, 58, 237, 0.25)',
              }}
              whileHover={{
                scale: 1.02,
                boxShadow: '0 12px 40px rgba(124, 58, 237, 0.35)',
              }}
              whileTap={{ scale: 0.98 }}
            >
              Start for free →
            </motion.button>
          </Link>
          <p
            className="mt-4 text-sm"
            style={{ fontFamily: 'var(--font-body)', color: '#947BAD' }}
          >
            Free forever for up to 5 people.
          </p>
        </motion.div>
      </section>

      {/* ——— FOOTER ——— */}
      <footer className="py-6 px-6 md:px-12 flex flex-wrap justify-between items-center gap-4">
        <span
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: '13px',
            color: '#947BAD',
          }}
        >
          Cherish © 2026
        </span>
        <div
          className="flex gap-4"
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: '13px',
            color: '#947BAD',
          }}
        >
          <Link href="/privacy" className="hover:underline">
            Privacy
          </Link>
          <span>·</span>
          <Link href="/terms" className="hover:underline">
            Terms
          </Link>
        </div>
      </footer>
    </main>
  )
}
