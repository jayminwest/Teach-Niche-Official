import { supabase, handleAuthStateChange } from '../supabase'

// Mock environment variables
const originalEnv = process.env
beforeEach(() => {
  jest.resetModules()
  process.env = {
    ...originalEnv,
    NEXT_PUBLIC_SUPABASE_URL: 'https://test.supabase.co',
    NEXT_PUBLIC_SUPABASE_ANON_KEY: 'test-key'
  }
})

afterEach(() => {
  process.env = originalEnv
})

describe('Supabase Client', () => {
  it('initializes supabase client with correct config', () => {
    expect(supabase.supabaseUrl).toBe('https://test.supabase.co')
    expect(supabase.supabaseKey).toBe('test-key')
  })

  it('throws error when environment variables are missing', () => {
    delete process.env.NEXT_PUBLIC_SUPABASE_URL
    delete process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    
    expect(() => {
      jest.isolateModules(() => {
        require('../supabase')
      })
    }).toThrow('Missing Supabase environment variables')
  })
})

describe('handleAuthStateChange', () => {
  it('registers auth state change callback', () => {
    const mockCallback = jest.fn()
    const mockUnsubscribe = jest.fn()
    
    // Mock the auth.onAuthStateChange method
    jest.spyOn(supabase.auth, 'onAuthStateChange').mockImplementation((callback) => {
      callback('SIGNED_IN', { user: { id: '123' }, session: {} })
      return { data: { subscription: { unsubscribe: mockUnsubscribe } } }
    })

    handleAuthStateChange(mockCallback)
    
    expect(mockCallback).toHaveBeenCalledWith('SIGNED_IN', expect.any(Object))
    expect(supabase.auth.onAuthStateChange).toHaveBeenCalled()
  })
})
