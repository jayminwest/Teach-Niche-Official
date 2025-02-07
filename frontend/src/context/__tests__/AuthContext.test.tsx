import { render, screen, act, waitFor } from '@testing-library/react'
import { useState } from 'react'
import userEvent from '@testing-library/user-event'
import { AuthProvider, useAuth } from '../AuthContext'
import { supabase } from '../../lib/supabase'
import { useRouter } from 'next/router'

// Mock next/router
jest.mock('next/router', () => ({
  useRouter: jest.fn()
}))

// Mock supabase client
jest.mock('../../lib/supabase', () => ({
  supabase: {
    auth: {
      getSession: jest.fn(),
      onAuthStateChange: jest.fn(() => ({
        data: { subscription: { unsubscribe: jest.fn() } }
      })),
      signInWithPassword: jest.fn(),
      signInWithOAuth: jest.fn(),
      signOut: jest.fn()
    },
    from: jest.fn(() => ({
      select: jest.fn(() => ({
        or: jest.fn(() => ({
          maybeSingle: jest.fn()
        })),
        single: jest.fn()
      })),
      insert: jest.fn(() => ({
        select: jest.fn(() => ({
          single: jest.fn()
        }))
      })),
      update: jest.fn(() => ({
        eq: jest.fn(() => ({
          select: jest.fn(() => ({
            single: jest.fn()
          }))
        }))
      }))
    }))
  }
}))

// Test component that uses auth context
const TestComponent = () => {
  const { user, signIn, signOut } = useAuth()
  const [error, setError] = useState('')

  const handleSignIn = async () => {
    try {
      await signIn('test@example.com', 'password')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    }
  }

  return (
    <div>
      {user ? (
        <>
          <div data-testid="user-email">{user.email}</div>
          <button onClick={() => signOut()}>Sign Out</button>
        </>
      ) : (
        <>
          <button onClick={handleSignIn}>Sign In</button>
          {error && <div data-testid="error-message">{error}</div>}
        </>
      )}
    </div>
  )
}

describe('AuthContext', () => {
  const mockRouter = {
    push: jest.fn(),
    pathname: '/test'
  }
  
  beforeEach(() => {
    jest.clearAllMocks()
    ;(useRouter as jest.Mock).mockReturnValue(mockRouter)
  })

  it('provides initial auth state', async () => {
    const mockSession = {
      user: null,
      session: null
    }
    
    ;(supabase.auth.getSession as jest.Mock).mockResolvedValueOnce({
      data: { session: null }
    })

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    )

    await waitFor(() => {
      expect(screen.getByText(/Sign In/i)).toBeInTheDocument()
    })
  })

  it('handles sign in successfully', async () => {
    const mockUser = {
      id: '123',
      email: 'test@example.com',
      user_metadata: {}
    }
    const mockSession = { user: mockUser }

    ;(supabase.auth.signInWithPassword as jest.Mock).mockResolvedValueOnce({
      data: { user: mockUser, session: mockSession },
      error: null
    })

    ;(supabase.from as jest.Mock)().select().or().maybeSingle.mockResolvedValueOnce({
      data: null,
      error: null
    })

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    )

    const signInButton = screen.getByText(/Sign In/i)
    await act(async () => {
      await userEvent.click(signInButton)
    })

    await waitFor(() => {
      expect(screen.getByTestId('user-email')).toHaveTextContent('test@example.com')
    })
  })

  it('handles sign out successfully', async () => {
    const mockUser = {
      id: '123',
      email: 'test@example.com',
      user_metadata: {}
    }
    const mockSession = { user: mockUser }

    ;(supabase.auth.getSession as jest.Mock).mockResolvedValueOnce({
      data: { session: mockSession }
    })

    ;(supabase.auth.signOut as jest.Mock).mockResolvedValueOnce({
      error: null
    })

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    )

    const signOutButton = await screen.findByText(/Sign Out/i)
    await act(async () => {
      await userEvent.click(signOutButton)
    })

    await waitFor(() => {
      expect(mockRouter.push).toHaveBeenCalledWith('/auth/login')
    })
  })

  it('handles profile creation for new users', async () => {
    const mockUser = {
      id: '123',
      email: 'test@example.com',
      user_metadata: { full_name: 'Test User' }
    }
    const mockSession = { user: mockUser }

    ;(supabase.auth.getSession as jest.Mock).mockResolvedValueOnce({
      data: { session: mockSession }
    })

    ;(supabase.from as jest.Mock)().select().or().maybeSingle.mockResolvedValueOnce({
      data: null,
      error: null
    })

    const mockProfile = {
      id: '123',
      email: 'test@example.com',
      full_name: 'Test User'
    }

    ;(supabase.from as jest.Mock)().insert().select().single.mockResolvedValueOnce({
      data: mockProfile,
      error: null
    })

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    )

    await waitFor(() => {
      expect(screen.getByTestId('user-email')).toBeInTheDocument()
    })
  })

  it('handles sign in errors', async () => {
    const mockError = { message: 'Invalid credentials' }
    
    ;(supabase.auth.signInWithPassword as jest.Mock).mockResolvedValueOnce({
      data: { user: null, session: null },
      error: mockError
    })

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    )

    const signInButton = screen.getByText(/Sign In/i)
    
    await act(async () => {
      await userEvent.click(signInButton)
    })

    await waitFor(() => {
      expect(screen.getByTestId('error-message')).toHaveTextContent('Invalid credentials')
    })
  })

  it('handles password reset', async () => {
    global.fetch = jest.fn().mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ message: 'Password reset email sent' })
    })

    const TestResetComponent = () => {
      const { resetPassword } = useAuth()
      const handleReset = () => resetPassword('test@example.com')
      return <button onClick={handleReset}>Reset Password</button>
    }

    render(
      <AuthProvider>
        <TestResetComponent />
      </AuthProvider>
    )

    const resetButton = screen.getByText(/Reset Password/i)
    await userEvent.click(resetButton)

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'test@example.com' })
      })
    })
  })

  it('handles Google sign in', async () => {
    const mockUser = { id: '123', email: 'test@example.com' }
    const mockSession = { user: mockUser }

    ;(supabase.auth.signInWithOAuth as jest.Mock).mockResolvedValueOnce({
      data: { user: mockUser, session: mockSession },
      error: null
    })

    const TestGoogleComponent = () => {
      const { signInWithGoogle } = useAuth()
      return <button onClick={signInWithGoogle}>Google Sign In</button>
    }

    render(
      <AuthProvider>
        <TestGoogleComponent />
      </AuthProvider>
    )

    const googleButton = screen.getByText(/Google Sign In/i)
    await userEvent.click(googleButton)

    await waitFor(() => {
      expect(supabase.auth.signInWithOAuth).toHaveBeenCalledWith({
        provider: 'google',
        options: {
          redirectTo: expect.stringContaining('/auth/callback')
        }
      })
    })
  })

  it('handles profile creation errors', async () => {
    const mockUser = {
      id: '123',
      email: 'test@example.com',
      user_metadata: { full_name: 'Test User' }
    }
    const mockSession = { user: mockUser }
    const mockError = new Error('Database error')

    ;(supabase.auth.getSession as jest.Mock).mockResolvedValueOnce({
      data: { session: mockSession }
    })

    ;(supabase.from as jest.Mock)().select().or().maybeSingle.mockResolvedValueOnce({
      data: null,
      error: null
    })

    ;(supabase.from as jest.Mock)().insert.mockImplementationOnce(() => ({
      select: () => ({
        single: () => Promise.reject(mockError)
      })
    }))

    const consoleSpy = jest.spyOn(console, 'error').mockImplementation()

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    )

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith('Error managing profile:', mockError)
    })

    consoleSpy.mockRestore()
  })

  it('cleans up auth subscription on unmount', async () => {
    const unsubscribeMock = jest.fn()
    ;(supabase.auth.onAuthStateChange as jest.Mock).mockReturnValueOnce({
      data: { subscription: { unsubscribe: unsubscribeMock } }
    })

    const { unmount } = render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    )

    unmount()

    expect(unsubscribeMock).toHaveBeenCalled()
  })
})
