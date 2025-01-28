import { NextPage } from 'next'
import {
  Box,
  Flex,
  Input,
  Select,
  SimpleGrid,
  useColorModeValue,
} from '@chakra-ui/react'
import { LessonCard } from '../components/LessonCard'
import { useState } from 'react'

const Lessons: NextPage = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState('newest')
  const textColor = useColorModeValue('gray.600', 'gray.400')

  const handlePurchaseClick = () => {
    console.log('Purchase clicked')
  }

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
  }

  const handleSort = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortBy(e.target.value)
  }

  return (
    <Box 
      minH="100vh" 
      bg={useColorModeValue('gray.50', 'gray.900')}
      p="4"
    >
      <Box mb={{ base: 6, md: 8 }}>
        <Flex 
          gap={4} 
          mb={6} 
          direction={{ base: "column", md: "row" }}
        >
          <Input
            placeholder="Search lessons..."
            value={searchQuery}
            onChange={handleSearch}
            bg={useColorModeValue('white', 'gray.700')}
            maxW={{ base: "100%", md: "400px" }}
          />
          <Select
            value={sortBy}
            onChange={handleSort}
            bg={useColorModeValue('white', 'gray.700')}
            maxW={{ base: "100%", md: "200px" }}
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
          </Select>
        </Flex>

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
