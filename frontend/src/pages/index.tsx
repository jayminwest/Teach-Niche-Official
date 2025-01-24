import { Heading, Text, VStack, Box, useColorModeValue, SimpleGrid, Button } from '@chakra-ui/react'
import { useRouter } from 'next/router'
import React from 'react'
import Link from 'next/link'
import Hero from '../components/Hero'
import { Card } from '../components/Card'
import { RiBookOpenLine, RiArrowRightLine } from 'react-icons/ri'

function ErrorBoundary({ children }: { children: React.ReactNode }) {
  const [hasError, setHasError] = React.useState(false)

  React.useEffect(() => {
    const errorHandler = () => setHasError(true)
    window.addEventListener('error', errorHandler)
    return () => window.removeEventListener('error', errorHandler)
  }, [])

  if (hasError) {
    return <Box p={4} textAlign="center">Something went wrong. Please try again later.</Box>
  }

  return <>{children}</>
}

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
    <Layout>
      <ErrorBoundary>
        <VStack spacing={{ base: 6, md: 8 }} align="stretch">
        <Hero />
        
        <Box py={8}>
          <Heading size="xl" mb={6}>Featured Lessons</Heading>
          <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
            {[
              {
                id: 1,
                title: 'Web Development Basics',
                description: 'Learn HTML, CSS and JavaScript fundamentals',
                price: '49.99'
              },
              {
                id: 2, 
                title: 'Python for Beginners',
                description: 'Start your programming journey with Python',
                price: '39.99'
              },
              {
                id: 3,
                title: 'Data Visualization',
                description: 'Master data visualization with D3.js',
                price: '59.99'
              }
            ].map((lesson) => (
              <Card key={lesson.id} hoverable>
                <Heading size="md" mb={2}>{lesson.title}</Heading>
                <Text mb={4} color={textColor}>{lesson.description}</Text>
                <Text fontWeight="bold">${lesson.price}</Text>
              </Card>
            ))}
          </SimpleGrid>
        </Box>

        <Box textAlign="center" py={12} bg={useColorModeValue('gray.50', 'gray.800')} borderRadius="xl">
          <Heading size="lg" mb={4}>Ready to Start Learning?</Heading>
          <Text fontSize="lg" color={textColor} mb={6}>
            Join thousands of students already advancing their careers
          </Text>
          <Link href="/auth/signup" passHref>
            <Button 
              colorScheme="blue" 
              size="lg" 
              rightIcon={<RiArrowRightLine />}
            >
              Get Started Now
            </Button>
          </Link>
        </Box>
      </VStack>
      </ErrorBoundary>
    </Layout>
  )
}

