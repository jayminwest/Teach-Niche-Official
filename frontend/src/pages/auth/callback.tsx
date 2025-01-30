import { useEffect } from 'react'
import { Box, Spinner, Center, Text, VStack } from '@chakra-ui/react'
import { useRouter } from 'next/router'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../context/AuthContext'

export default function AuthCallback() {
  const router = useRouter()
  const { isLoading, user } = useAuth()
  
  useEffect(() => {
    const handleCallback = async () => {
      try {
        const { data, error } = await supabase.auth.getSession()
        
        if (error) throw error
        
        if (data?.session) {
          // Wait for auth context to update
          if (user) {
            router.replace('/profile')
          }
        } else {
          throw new Error('No session found')
        }
      } catch (error) {
        console.error('Error in auth callback:', error)
        router.replace('/auth/login')
      }
    }

    if (!isLoading) {
      handleCallback()
    }
  }, [router, isLoading, user])

  return (
    <Center h="100vh">
      <VStack spacing={4}>
        <Spinner size="xl" />
        <Text>Completing sign in...</Text>
      </VStack>
    </Center>
  )
}
