import { Heading, Text, VStack, Box, useColorModeValue, SimpleGrid, Button } from '@chakra-ui/react'
import Layout from '../components/Layout'
import { useRouter } from 'next/router'
import React, { useState } from 'react'
import Link from 'next/link'
import Hero from '../components/Hero'
import { LessonCard } from '../components/LessonCard'
import { RiBookOpenLine, RiArrowRightLine } from 'react-icons/ri'

interface Lesson {
  id: string;
  title: string;
  description: string;
  price: number;
  created_at: string;
  updated_at: string;
  thumbnail_url?: string;
  stripe_price_id?: string;
  stripe_account_id: string;
  is_featured?: boolean;
  categories?: string[];
  vimeo_video_id?: string;
}

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

  const [featuredLessons, setFeaturedLessons] = useState<Lesson[]>([])

  React.useEffect(() => {
    const fetchFeaturedLessons = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/lessons/featured`
        )
        const data = await response.json()
        setFeaturedLessons(data)
      } catch (error) {
        console.error('Error fetching featured lessons:', error)
      }
    }

    fetchFeaturedLessons()
  }, [])

  return (
    <Layout showHeader={false} showFooter={false}>
      <ErrorBoundary>
        <VStack spacing={{ base: 6, md: 8 }} align="stretch">
        <Hero />
        
        <Box py={8}>
          <Heading size="xl" mb={6}>Featured Lessons</Heading>
          <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
            {featuredLessons.map((lesson) => (
              <LessonCard
                key={lesson.id}
                id={lesson.id}
                title={lesson.title}
                description={lesson.description}
                price={lesson.price}
                stripe_price_id={lesson.stripe_price_id}
                stripe_account_id={lesson.stripe_account_id}
                onPurchaseClick={() => router.push(`/lessons/${lesson.id}`)}
              />
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

