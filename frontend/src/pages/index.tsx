import { Heading, Text, VStack, Box, useColorModeValue } from '@chakra-ui/react'
import { useRouter } from 'next/router'
import React from 'react'

export default function Home() {
  const textColor = useColorModeValue('gray.600', 'gray.400')
  const router = useRouter()

  React.useEffect(() => {
    const handleRouteChangeError = (err: { cancelled?: boolean }) => {
      if (err.cancelled) {
        console.log('Route change cancelled')
      }
    }

    router.events.on('routeChangeError', handleRouteChangeError)
    return () => {
      router.events.off('routeChangeError', handleRouteChangeError)
    }
  }, [router])

  return (
    <VStack spacing={{ base: 6, md: 8 }} align="stretch">
      <Box>
        <Heading 
          size={{ base: "xl", md: "2xl" }} 
          mb={{ base: 2, md: 4 }}
        >
          Welcome
        </Heading>
        <Text fontSize={{ base: "md", md: "lg" }} color={textColor}>
          Start your learning journey today
        </Text>
      </Box>
    </VStack>
  )
}

// Add showHero prop for this page
Home.getInitialProps = () => {
  return { showHero: true }
} 
