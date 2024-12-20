import { Heading, Text, VStack, Box, useColorModeValue } from '@chakra-ui/react'

export default function Home() {
  const textColor = useColorModeValue('gray.600', 'gray.400')

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