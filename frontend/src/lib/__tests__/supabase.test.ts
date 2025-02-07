import { createClient } from '@supabase/supabase-js'
import { handleAuthStateChange, supabase } from '../supabase'

jest.mock('@supabase/supabase-js')

const mockCreateClient = jest.fn()

// Setup createClient mock
;(createClient as jest.Mock).mockImplementation((...args) => {
  return {
    auth: {
      onAuthStateChange: jest.fn()
    }
  }
})

describe('Supabase Client', () => {
  const mockSupabaseUrl = 'https://test.supabase.co'
  const mockSupabaseKey = 'test-key'
  
  beforeEach(() => {
    // Reset modules before each test
    jest.resetModules()
    jest.clearAllMocks()
    
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
    
    expect(mockCreateClient).toHaveBeenCalledWith(
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
    const mockOnAuthStateChange = jest.fn((callback) => {
      callback('SIGNED_IN', { user: { id: '123' }, session: {} })
      return { data: { subscription: { unsubscribe: mockUnsubscribe } } }
    })

    // Create a mock Supabase instance
    const mockSupabase = {
      auth: {
        onAuthStateChange: mockOnAuthStateChange
      }
    }

    // Call handleAuthStateChange with our mock
    handleAuthStateChange(mockCallback, mockSupabase)
    
    expect(mockCallback).toHaveBeenCalledWith('SIGNED_IN', expect.any(Object))
    expect(mockOnAuthStateChange).toHaveBeenCalled()
  })
})
