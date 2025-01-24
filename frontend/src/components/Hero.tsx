import { Box, Container, Heading, Text, Button, VStack } from '@chakra-ui/react'

export const Hero = () => {
  return (
    <Box 
      bg="gray.900" 
      color="white"
      py={{ base: 16, md: 24 }}
      backgroundImage="linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url('/escalator.jpg')"
      backgroundSize="cover"
      backgroundPosition="center"
    >
      <Container maxW="7xl">
        <VStack
          spacing={6}
          align="center"
          textAlign="center"
          maxW="3xl"
          mx="auto"
        >
          <Heading
            as="h1"
            size={{ base: "2xl", md: "3xl" }}
            fontWeight="bold"
          >
            About Teach Niche
          </Heading>
          <Text 
            fontSize={{ base: "lg", md: "xl" }}
            color="gray.200"
          >
            Empowering the kendama community by providing a platform for players to share
            knowledge, hone their skills, and earn income doing what they love.
          </Text>
          <Button
            size="lg"
            colorScheme="yellow"
            px={8}
            onClick={() => window.location.href = '/lessons'}
          >
            View Lessons
          </Button>
        </VStack>
      </Container>
    </Box>
  )
}

export default Hero 
