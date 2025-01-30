import { createContext, useContext, useEffect, useState } from 'react'
import { User, Session } from '@supabase/supabase-js'
import { supabase } from '../lib/supabase'
import { useRouter } from 'next/router'

interface AuthResponse {
  user: User | null
  session: Session | null
  error?: Error | null
}

interface Profile {
  id: string
  full_name: string
  email: string
  avatar_url?: string
  bio?: string
  social_media_tag?: string
  stripe_account_id?: string
  stripe_onboarding_complete: boolean
}

type AuthContextType = {
  user: User | null
  session: Session | null
  isLoading: boolean
  profile: Profile | null
  signIn: (email: string, password: string) => Promise<AuthResponse>
  signUp: (email: string, password: string) => Promise<AuthResponse>
  signOut: () => Promise<void>
  resetPassword: (email: string) => Promise<void>
  signInWithGoogle: () => Promise<AuthResponse>
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
  const [profile, setProfile] = useState<Profile | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  const createOrUpdateProfile = async (user: User) => {
    try {
      const { data: existingProfile, error: fetchError } = await supabase
        .from('profiles')
        .select()
        .eq('id', user.id)
        .maybeSingle()

      if (!existingProfile) {
        // Profile doesn't exist, create it
        const newProfile = {
          id: user.id,
          full_name: user.user_metadata.full_name || '',
          avatar_url: user.user_metadata.avatar_url,
          stripe_onboarding_complete: false,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }

        const { data: createdProfile, error: createError } = await supabase
          .from('profiles')
          .insert([newProfile])
          .select()
          .single()

        if (createError) throw createError
        setProfile(createdProfile)
      } else if (existingProfile) {
        setProfile(existingProfile)
      }
    } catch (error) {
      console.error('Error managing profile:', error)
    }
  }

  useEffect(() => {
    let mounted = true;
    
    const fetchSession = async () => {
      try {
        console.log('🔄 Fetching initial session...')
        const { data: { session } } = await supabase.auth.getSession()
        console.log('📥 Initial session:', session ? 'exists' : 'null')
        
        if (!mounted) {
          console.log('⚠️ Component unmounted, skipping state updates')
          return
        }

        setSession(session)
        setUser(session?.user ?? null)
        
        if (session?.user) {
          console.log('👤 Creating/updating profile for user:', session.user.id)
          await createOrUpdateProfile(session.user)
        }
      } catch (error) {
        console.error('❌ Error fetching session:', error)
      } finally {
        if (mounted) {
          console.log('✅ Setting loading state to false')
          setIsLoading(false)
        }
      }
    }

    fetchSession()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('🔔 Auth state changed:', event, 'Session:', session ? 'exists' : 'null')
      
      if (!mounted) {
        console.log('⚠️ Component unmounted, skipping auth state change')
        return
      }

      setSession(session)
      setUser(session?.user ?? null)
      
      if (event === 'SIGNED_IN' && session?.user) {
        console.log('✅ User signed in, updating profile...')
        await createOrUpdateProfile(session.user)
        if (mounted) {
          console.log('🔄 Redirecting to profile...')
          router.push('/profile')
        }
      } else if (event === 'SIGNED_OUT') {
        console.log('👋 User signed out')
        setProfile(null)
        if (mounted) {
          router.push('/auth/login')
        }
      }
    })

    return () => {
      console.log('🧹 Cleaning up auth subscriptions')
      mounted = false
      subscription.unsubscribe()
    }
  }, [router])

  const value = {
    user,
    session,
    profile,
    isLoading,
    signIn: async (email: string, password: string) => {
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) {
          throw error;
        }

        // Update local session state
        setSession(data.session);
        setUser(data.user);
        
        return { user: data.user, session: data.session };
      } catch (error) {
        // Make sure to reset loading state on error
        setIsLoading(false);
        throw error;
      }
    },
    signUp: async (email: string, password: string) => {
      try {
        // First validate the email and password locally
        if (!email || !email.includes('@')) {
          throw new Error('Please enter a valid email address');
        }
        if (!password || password.length < 8) {
          throw new Error('Password must be at least 8 characters');
        }

        // Try to connect to the API
        const response = await fetch('/api/auth/signup', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email, password }),
        });

        // Handle connection errors
        if (!response.ok) {
          let errorData;
          try {
            errorData = await response.json();
          } catch (jsonError) {
            throw new Error('Failed to parse error response');
          }
          throw new Error(errorData.detail || errorData.error || 'Signup failed');
        }

        const data = await response.json();
        
        // Update local session state
        const { data: { session } } = await supabase.auth.getSession();
        setSession(session);
        setUser(session?.user ?? null);
        
        return data;
      } catch (error) {
        if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
          throw new Error('Unable to connect to the server. Please check your internet connection and make sure the backend is running.');
        }
        throw error;
      }
    },
    signOut: async () => {
      try {
        await supabase.auth.signOut()
        
        // Clear local state immediately
        setSession(null)
        setUser(null)
        setProfile(null)
        
        // Force router navigation
        router.push('/auth/login')
      } catch (error) {
        console.error('Error during sign out:', error)
        throw error
      }
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
    signInWithGoogle: async () => {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`
        }
      });

      if (error) {
        throw error;
      }

      return { user: data.user, session: data.session };
    },
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => useContext(AuthContext)
