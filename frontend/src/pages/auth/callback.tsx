import { useEffect } from 'react'
import { Box, Spinner, Center } from '@chakra-ui/react'
import { useRouter } from 'next/router'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../context/AuthContext'

export default function AuthCallback() {
  const router = useRouter()
  const { isLoading } = useAuth()
  
  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Handle the callback - this will automatically exchange the code
        const { data, error } = await supabase.auth.getSession()
        
        if (error) throw error
        
        if (data?.session) {
          // Add a small delay to ensure auth context is updated
          setTimeout(() => {
            router.push('/profile')
          }, 500)
        } else {
          throw new Error('No session found')
        }
      } catch (error) {
        console.error('Error in auth callback:', error)
        router.push('/auth/login')
      }
    }

    if (typeof window !== 'undefined' && !isLoading) {
      handleCallback()
    }
  }, [router, isLoading])

  return (
    <Center h="100vh">
      <Box>
        <Spinner size="xl" />
      </Box>
    </Center>
  )
}
