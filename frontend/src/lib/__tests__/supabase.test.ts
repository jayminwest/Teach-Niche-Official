import { createClient } from '@supabase/supabase-js'
import { handleAuthStateChange } from '../supabase'

jest.mock('@supabase/supabase-js')

describe('Supabase Client', () => {
  let mockCreateClient;
  
  beforeEach(() => {
    mockCreateClient = jest.fn().mockReturnValue({
      auth: {
        onAuthStateChange: jest.fn()
      }
    });
    (createClient as jest.Mock).mockImplementation(mockCreateClient);
  })
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
    // Force re-import of supabase after setting environment variables
    jest.isolateModules(() => {
      const { supabase } = require('../supabase');
      expect(supabase).toBeDefined();
    
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
