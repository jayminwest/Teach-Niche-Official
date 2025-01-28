import { NextPage } from 'next'
import {
  Box,
  Heading,
  Text,
  SimpleGrid,
  useColorModeValue,
} from '@chakra-ui/react'
import { LessonCard } from '../components/LessonCard'

const Lessons: NextPage = () => {
  const textColor = useColorModeValue('gray.600', 'gray.400')

  const handlePurchaseClick = () => {
    console.log('Purchase clicked')
  }

  return (
    <Box 
      minH="100vh" 
      bg={useColorModeValue('gray.50', 'gray.900')}
      p="4"
    >
      <Box mb={{ base: 6, md: 8 }}>
        <Box>
          <Heading 
            size={{ base: "xl", md: "2xl" }} 
            mb={{ base: 2, md: 4 }}
          >
            Lessons!
          </Heading>
          <Text fontSize={{ base: "md", md: "lg" }} color={textColor}>
            Explore our collection of lessons and tutorials.
          </Text>
        </Box>

        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
          <LessonCard
            id="1"
            title="Getting Started with Web Development"
            description="Learn the fundamentals of web development including HTML, CSS, and JavaScript. Perfect for beginners looking to start their coding journey."
            price={29.99}
            isNew={true}
            onPurchaseClick={handlePurchaseClick}
          />
          <LessonCard
            id="2"
            title="Advanced React Patterns"
            description="Master advanced React concepts including hooks, context, and performance optimization techniques for building scalable applications."
            price={49.99}
            onPurchaseClick={handlePurchaseClick}
          />
          <LessonCard
            id="3"
            title="Full Stack Development with Next.js"
            description="Build modern full-stack applications using Next.js, incorporating API routes, authentication, and database integration."
            price={59.99}
            isNew={true}
            onPurchaseClick={handlePurchaseClick}
          />
          <LessonCard
            id="4"
            title="TypeScript Mastery"
            description="Deep dive into TypeScript features, advanced types, and best practices for building type-safe applications."
            price={39.99}
            onPurchaseClick={handlePurchaseClick}
          />
        </SimpleGrid>
      </Box>
    </Box>
  )
}

export default Lessons
