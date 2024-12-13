import Head from 'next/head'
import { Button } from '@/components/Button'
import { supabase } from '@/lib/supabase'

export default function Home() {
  const handleTestBackend = async () => {
    try {
      const response = await fetch('http://localhost:8000')
      const data = await response.text()
      alert(`Backend response: ${data}`)
    } catch (error) {
      alert('Failed to connect to backend')
    }
  }

  const handleTestAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession()
    alert(session ? 'Authenticated!' : 'Not authenticated')
  }

  const handleTestSupabaseBackend = async () => {
    try {
      const response = await fetch('http://localhost:8000/test-supabase')
      const data = await response.json()
      alert(`Backend Supabase connection: ${JSON.stringify(data)}`)
    } catch (error) {
      alert('Failed to test Supabase connection through backend')
    }
  }

  const handleTestStripe = async () => {
    try {
      const response = await fetch('http://localhost:8000/test-stripe')
      const data = await response.json()
      alert(`Backend Stripe connection: ${JSON.stringify(data)}`)
    } catch (error) {
      alert('Failed to test Stripe connection through backend')
    }
  }

  return (
    <>
      <Head>
        <title>Welcome to Our App</title>
        <meta name="description" content="Welcome to our full-stack application" />
      </Head>
      <main className="min-h-screen flex flex-col items-center justify-center p-4 gap-8">
        <h1 className="text-4xl font-bold mb-4">
          Welcome to Our App
        </h1>
        <p className="text-lg text-gray-600">
          A full-stack application with Next.js frontend and Python backend
        </p>
        <div className="flex gap-4">
          <Button
            label="Test Backend"
            onClick={handleTestBackend}
            aria-label="Test backend connection"
          />
          <Button
            label="Test Auth"
            variant="secondary"
            onClick={handleTestAuth}
            aria-label="Test authentication status"
          />
          <Button
            label="Test Supabase Backend"
            variant="secondary"
            onClick={handleTestSupabaseBackend}
            aria-label="Test Supabase connection through backend"
          />
          <Button
            label="Test Stripe"
            variant="secondary"
            onClick={handleTestStripe}
            aria-label="Test Stripe connection through backend"
          />
        </div>
      </main>
    </>
  )
} 