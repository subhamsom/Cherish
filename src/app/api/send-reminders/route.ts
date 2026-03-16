import { NextResponse } from 'next/server'
import { Resend } from 'resend'
import { createClient as createSupabaseClient } from '@supabase/supabase-js'

type Repeat = 'none' | 'weekly' | 'monthly' | 'yearly'
type Channel = 'email' | 'in_app' | 'both'

type ReminderRecord = {
  id: string
  user_id: string
  person_id: string | null
  title: string
  remind_at: string
  repeat: Repeat
  channel: Channel
  snoozed_until: string | null
  is_sent: boolean
  people: {
    name: string | null
    relationship_type: string | null
  } | null
}

function getFirstName(fullName?: string | null, email?: string | null): string {
  if (fullName && fullName.trim().length > 0) {
    return fullName.trim().split(/\s+/)[0]!
  }
  if (email) {
    const localPart = email.split('@')[0] ?? ''
    if (localPart) return localPart
  }
  return 'there'
}

function buildEmailHtml(params: {
  firstName: string
  title: string
  personName?: string | null
  siteUrl: string
}) {
  const { firstName, title, personName, siteUrl } = params
  const remindersUrl = `${siteUrl.replace(/\/$/, '')}/reminders`

  const personLine = personName
    ? `<p style="margin: 0 0 16px 0; font-size: 14px; color: #4B5563;">This is about <strong>${personName}</strong>.</p>`
    : ''

  return `
  <html>
    <body style="margin:0; padding:0; background-color:#FEFCFF;">
      <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="background-color:#FEFCFF; padding:32px 16px;">
        <tr>
          <td align="center">
            <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="max-width:560px; background-color:#FFFFFF; border-radius:16px; padding:28px 24px; font-family:-apple-system, BlinkMacSystemFont, 'SF Pro Text', system-ui, -system-ui, sans-serif; box-shadow:0 10px 30px rgba(124,58,237,0.08); border:1px solid #E5E1FF;">
              <tr>
                <td>
                  <p style="margin:0 0 12px 0; font-size:14px; letter-spacing:0.08em; text-transform:uppercase; color:#7C3AED;">Cherish</p>
                  <h1 style="margin:0 0 16px 0; font-size:22px; color:#1F1F1F; font-weight:600;">Hey ${firstName},</h1>
                  <p style="margin:0 0 12px 0; font-size:15px; line-height:1.6; color:#374151;">
                    You asked us to remind you about <strong>${title}</strong>.
                  </p>
                  ${personLine}
                  <p style="margin:0 0 24px 0; font-size:14px; line-height:1.6; color:#6B7280;">
                    Take a moment to reach out, send a note, or do something kind for them. Future you will be glad you did.
                  </p>
                  <table cellpadding="0" cellspacing="0" role="presentation" style="margin:0 0 24px 0;">
                    <tr>
                      <td align="center">
                        <a href="${remindersUrl}" style="display:inline-block; padding:12px 22px; border-radius:999px; background-color:#7C3AED; color:#FFFFFF; text-decoration:none; font-size:14px; font-weight:500; box-shadow:0 8px 18px rgba(124,58,237,0.35);">
                          Open Cherish
                        </a>
                      </td>
                    </tr>
                  </table>
                  <p style="margin:0 0 8px 0; font-size:12px; color:#9CA3AF;">
                    Sent with love from Cherish · Unsubscribe
                  </p>
                  <p style="margin:0; font-size:11px; color:#D1D5DB;">
                    You’re receiving this because you created a reminder in Cherish.
                  </p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
  </html>
  `
}

function getNextRemindAt(remindAtIso: string, repeat: Repeat): string | null {
  if (repeat === 'none') return null
  const d = new Date(remindAtIso)
  if (Number.isNaN(d.getTime())) return null

  if (repeat === 'weekly') {
    d.setDate(d.getDate() + 7)
  } else if (repeat === 'monthly') {
    d.setMonth(d.getMonth() + 1)
  } else if (repeat === 'yearly') {
    d.setFullYear(d.getFullYear() + 1)
  }
  return d.toISOString()
}

export async function GET(request: Request) {
  const authHeader = request.headers.get('authorization') || ''
  const expectedSecret = process.env.CRON_SECRET

  if (!expectedSecret || authHeader !== `Bearer ${expectedSecret}`) {
    return new Response('Unauthorized', { status: 401 })
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  const resendApiKey = process.env.RESEND_API_KEY
  const siteUrlEnv = process.env.NEXT_PUBLIC_SITE_URL

  if (!supabaseUrl || !serviceRoleKey || !resendApiKey || !siteUrlEnv) {
    console.error('[Cron] Missing required environment variables.')
    return NextResponse.json({ error: 'Server misconfigured' }, { status: 500 })
  }

  const supabase = createSupabaseClient(supabaseUrl, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  })

  const resend = new Resend(resendApiKey)
  const nowIso = new Date().toISOString()

  const { data: reminders, error: remindersError } = await supabase
    .from('reminders')
    .select(
      'id, user_id, person_id, title, remind_at, repeat, channel, snoozed_until, is_sent, people(name, relationship_type)'
    )
    .eq('is_sent', false)
    .in('channel', ['email', 'both'])
    .or(
      `and(remind_at.lte.${nowIso},snoozed_until.is.null),snoozed_until.lte.${nowIso}`
    )

  if (remindersError) {
    console.error('[Cron] Error querying reminders:', remindersError)
    return NextResponse.json(
      { error: 'Failed to query reminders' },
      { status: 500 }
    )
  }

  if (!reminders || reminders.length === 0) {
    return NextResponse.json({ sent: 0, skipped: 0 })
  }

  let sentCount = 0
  let skippedCount = 0

  for (const reminder of reminders as ReminderRecord[]) {
    try {
      const { data: userResult, error: userError } =
        await supabase.auth.admin.getUserById(reminder.user_id)

      if (userError || !userResult?.user?.email) {
        console.error(
          '[Cron] Unable to load user for reminder',
          reminder.id,
          userError
        )
        skippedCount++
        continue
      }

      const user = userResult.user
      const email = user.email
      const fullName =
        (user.user_metadata &&
          (user.user_metadata.full_name as string | undefined)) ||
        ''
      const firstName = getFirstName(fullName, email)
      const personName = reminder.people?.name ?? null

      const html = buildEmailHtml({
        firstName,
        title: reminder.title,
        personName,
        siteUrl: siteUrlEnv,
      })

      await resend.emails.send({
        from: 'Cherish Reminders <reminders@cherish.em>',
        to: email!,
        subject: `💜 Reminder: ${reminder.title}`,
        html,
      })

      const nextRemindAt = getNextRemindAt(reminder.remind_at, reminder.repeat)

      if (nextRemindAt) {
        await supabase
          .from('reminders')
          .update({
            remind_at: nextRemindAt,
            is_sent: false,
            snoozed_until: null,
          })
          .eq('id', reminder.id)
      } else {
        await supabase
          .from('reminders')
          .update({
            is_sent: true,
            snoozed_until: null,
          })
          .eq('id', reminder.id)
      }

      sentCount++
    } catch (err) {
      console.error('[Cron] Failed to process reminder', reminder.id, err)
      skippedCount++
    }
  }

  return NextResponse.json({ sent: sentCount, skipped: skippedCount })
}

