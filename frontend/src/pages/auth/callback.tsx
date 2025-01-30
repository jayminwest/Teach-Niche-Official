import { useEffect } from 'react'
import { Box, Spinner, Center } from '@chakra-ui/react'
import { useAuth } from '../../context/AuthContext'
import { useRouter } from 'next/router'

export default function AuthCallback() {
  const { isLoading, session } = useAuth()
  const router = useRouter()
  
  useEffect(() => {
    if (!isLoading && session) {
      router.push('/profile')
    }
  }, [isLoading, session, router])

  return (
    <Center h="100vh">
      <Box>
        <Spinner size="xl" />
      </Box>
    </Center>
  )
}
