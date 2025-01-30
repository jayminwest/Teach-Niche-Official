import { useEffect, useState } from 'react'
import { Box, Spinner, Center, Text, VStack } from '@chakra-ui/react'
import { useRouter } from 'next/router'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../context/AuthContext'

export default function AuthCallback() {
  const router = useRouter()
  const { isLoading, user } = useAuth()
  const [error, setError] = useState(null)
  
  useEffect(() => {
    const handleCallback = async () => {
      try {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession()
        
        if (sessionError) throw sessionError
        
        if (session) {
          // Only redirect once we have both session and user
          if (user) {
            await router.replace('/profile', undefined, { shallow: true })
          }
        } else {
          throw new Error('No session found')
        }
      } catch (err) {
        console.error('Error in auth callback:', err)
        setError(err.message)
        await router.replace('/auth/login')
      }
    }

    if (!isLoading) {
      handleCallback()
    }
  }, [router, isLoading, user])

  if (error) {
    return (
      <Center h="100vh">
        <VStack spacing={4}>
          <Text color="red.500">Authentication Error</Text>
          <Text>{error}</Text>
        </VStack>
      </Center>
    )
  }

  return (
    <Center h="100vh">
      <VStack spacing={4}>
        <Spinner size="xl" />
        <Text>Verifying your authentication...</Text>
      </VStack>
    </Center>
  )
}
