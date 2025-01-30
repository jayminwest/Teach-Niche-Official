import { useEffect } from 'react'
import { Box, Spinner, Center } from '@chakra-ui/react'
import { useAuth } from '../../context/AuthContext'

export default function AuthCallback() {
  const { isLoading } = useAuth()
  
  console.log('⏳ Callback page loading state:', isLoading)

  return (
    <Center h="100vh">
      <Box>
        <Spinner size="xl" />
      </Box>
    </Center>
  )
}
