import { useEffect } from 'react'
import { useRouter } from 'next/router'
import { Box, Spinner, Center } from '@chakra-ui/react'
import { useAuth } from '../../context/AuthContext'

export default function AuthCallback() {
  const router = useRouter()
  const { session } = useAuth()

  useEffect(() => {
    if (session) {
      router.push('/profile')
    }
  }, [session, router])

  return (
    <Center h="100vh">
      <Box>
        <Spinner size="xl" />
      </Box>
    </Center>
  )
}
