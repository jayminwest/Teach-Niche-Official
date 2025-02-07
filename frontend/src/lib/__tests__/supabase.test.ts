import { createClient } from '@supabase/supabase-js'
import { handleAuthStateChange } from '../supabase'

// Mock createClient
jest.mock('@supabase/supabase-js', () => ({
  createClient: jest.fn()
}))

describe('Supabase Client', () => {
  const mockSupabaseUrl = 'https://test.supabase.co'
  const mockSupabaseKey = 'test-key'
  
  beforeEach(() => {
    // Reset modules before each test
    jest.resetModules()
    
    // Reset environment
    process.env.NEXT_PUBLIC_SUPABASE_URL = mockSupabaseUrl
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = mockSupabaseKey
  })

  afterEach(() => {
    jest.resetAllMocks()
  })

  it('initializes supabase client with correct config', () => {
    // Import supabase after setting up mocks
    const { supabase } = require('../supabase')
    
    expect(createClient).toHaveBeenCalledWith(
      mockSupabaseUrl,
      mockSupabaseKey,
      expect.any(Object)
    )
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
