import { createContext, useContext, useEffect, useState } from 'react'
import { User, Session } from '@supabase/supabase-js'
import { supabase } from '../lib/supabase'
import { useRouter } from 'next/router'

interface AuthResponse {
  user: User | null
  session: Session | null
  error?: Error | null
}

type AuthContextType = {
  user: User | null
  session: Session | null
  isLoading: boolean
  signIn: (email: string, password: string) => Promise<AuthResponse>
  signUp: (email: string, password: string) => Promise<AuthResponse>
  signOut: () => Promise<void>
  resetPassword: (email: string) => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  isLoading: false,
  signIn: async () => ({ user: null, session: null, error: null }),
  signUp: async () => ({ user: null, session: null, error: null }),
  signOut: async () => {},
  resetPassword: async () => {},
})

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const fetchSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      setSession(session)
      setUser(session?.user ?? null)
      setIsLoading(false)
    }

    fetchSession()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      setSession(session)
      setUser(session?.user ?? null)
      
      if (event === 'SIGNED_IN') {
        router.push('/dashboard')
      } else if (event === 'SIGNED_OUT') {
        router.push('/auth/login')
      }
    })

    return () => subscription.unsubscribe()
  }, [router])

  const value = {
    user,
    session,
    isLoading,
    signIn: async (email: string, password: string) => {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'Login failed');
      }
      
      const data = await response.json();
      // Update local session state
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
      setUser(session?.user ?? null);
      return data;
    },
    signUp: async (email: string, password: string) => {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'Signup failed');
      }
      
      return await response.json();
    },
    signOut: async () => {
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
      });
      
      if (!response.ok) {
        throw new Error('Logout failed');
      }
      
      // Clear local session state
      setSession(null);
      setUser(null);
    },
    resetPassword: async (email: string) => {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'Password reset failed');
      }
    },
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => useContext(AuthContext)
