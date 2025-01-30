import { useEffect } from 'react'
import { Box, Spinner, Center } from '@chakra-ui/react'
import { useAuth } from '../../context/AuthContext'
import { useRouter } from 'next/router'
import { supabase } from '../../lib/supabase'

export default function AuthCallback() {
  const { isLoading, session } = useAuth()
  const router = useRouter()
  
  useEffect(() => {
    // Get the code from URL
    const code = router.query.code

    const handleCallback = async () => {
      try {
        if (code) {
          // Exchange the code for a session
          const { error } = await supabase.auth.exchangeCodeForSession(String(code))
          if (error) throw error
          
          // Redirect to profile page
          router.push('/profile')
        }
      } catch (error) {
        console.error('Error handling auth callback:', error)
        router.push('/auth/login')
      }
    }

    handleCallback()
  }, [router.query.code, router])

  return (
    <Center h="100vh">
      <Box>
        <Spinner size="xl" />
      </Box>
    </Center>
  )
}
