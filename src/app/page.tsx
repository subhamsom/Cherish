import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import LandingPage from '@/components/landing/LandingPage'

export default async function HomePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (user) redirect('/dashboard')

  return (
    <div
      className="min-h-screen"
      style={{
        colorScheme: 'light',
        backgroundColor: '#FEFCFF',
        backgroundImage: [
          'radial-gradient(ellipse 600px 500px at 15% 20%, rgba(196, 181, 253, 0.4) 0%, transparent 70%)',
          'radial-gradient(ellipse 400px 600px at 80% 10%, rgba(249, 168, 212, 0.3) 0%, transparent 70%)',
          'radial-gradient(ellipse 500px 400px at 60% 55%, rgba(221, 214, 254, 0.25) 0%, transparent 70%)',
          'radial-gradient(ellipse 350px 450px at 25% 75%, rgba(253, 242, 248, 0.4) 0%, transparent 70%)',
          'radial-gradient(ellipse 450px 350px at 88% 80%, rgba(249, 168, 212, 0.2) 0%, transparent 70%)',
          'radial-gradient(ellipse 300px 300px at 45% 30%, rgba(255, 255, 255, 0.7) 0%, transparent 60%)',
        ].join(', '),
      }}
    >
      <LandingPage />
    </div>
  )
}
