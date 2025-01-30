import { useEffect } from 'react'
import { Box, Spinner, Center } from '@chakra-ui/react'
import { useAuth } from '../../context/AuthContext'

export default function AuthCallback() {
  const { isLoading } = useAuth()

  return (
    <Center h="100vh">
      <Box>
        <Spinner size="xl" />
      </Box>
    </Center>
  )
}
