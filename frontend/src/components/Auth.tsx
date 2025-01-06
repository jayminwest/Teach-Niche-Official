import { useState } from 'react'
import { AuthError } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'
import { Button } from './Button'

export const Auth = () => {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSignIn = async () => {
    try {
      setLoading(true)
      const { error } = await supabase.auth.signInWithOtp({ email })
      if (error) throw error
      alert('Check your email for the login link!')
    } catch (error) {
      const errorMessage = error instanceof AuthError 
        ? error.message 
        : 'An error occurred during sign in'
      alert(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Enter your email"
        className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300"
      />
      <Button
        label={loading ? 'Loading...' : 'Sign In'}
        onClick={handleSignIn}
        disabled={loading}
      />
    </div>
  )
} 
