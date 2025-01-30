import { useEffect } from 'react'
import { Box, Spinner, Center } from '@chakra-ui/react'
import { useRouter } from 'next/router'
import { supabase } from '../../lib/supabase'

export default function AuthCallback() {
  const router = useRouter()
  
  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Handle the callback - this will automatically exchange the code
        const { data, error } = await supabase.auth.getSession()
        
        if (error) throw error
        
        if (data?.session) {
          // Successfully authenticated
          router.push('/profile')
        } else {
          throw new Error('No session found')
        }
      } catch (error) {
        console.error('Error in auth callback:', error)
        router.push('/auth/login')
      }
    }

    if (typeof window !== 'undefined') {
      handleCallback()
    }
  }, [router])

  return (
    <Center h="100vh">
      <Box>
        <Spinner size="xl" />
      </Box>
    </Center>
  )
}
