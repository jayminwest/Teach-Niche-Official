import { NextPage } from 'next'
import { Heading, Text, VStack, Box, useColorModeValue } from '@chakra-ui/react'
import Layout from '../components/Layout'
import { LessonCard } from '../components/LessonCard'

const Lessons: NextPage = () => {
  const textColor = useColorModeValue('gray.600', 'gray.400')

  const handlePurchaseClick = () => {
    console.log('Purchase clicked')
  }

  return (
    <Layout showHeader={false} showFooter={false}>
      <VStack spacing={{ base: 6, md: 8 }} align="stretch">
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

        <LessonCard
          id="1"
          title="Getting Started with Web Development"
          description="Learn the fundamentals of web development including HTML, CSS, and JavaScript. Perfect for beginners looking to start their coding journey."
          price={29.99}
          isNew={true}
          onPurchaseClick={handlePurchaseClick}
        />
      </VStack>
    </Layout>
  )
}

export default Lessons
