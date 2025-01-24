import { NextPage } from 'next'
import { Heading, Text, VStack, Box, useColorModeValue } from '@chakra-ui/react'
import Layout from '../components/Layout'

const Lessons: NextPage = () => {
  const textColor = useColorModeValue('gray.600', 'gray.400')

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
      </VStack>
    </Layout>
  )
}


export default Lessons
