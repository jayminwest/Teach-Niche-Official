import { Box, Button, Container, FormControl, FormLabel, Heading, Input, Link, Text, VStack } from '@chakra-ui/react'
import { useRouter } from 'next/router'
import { useState } from 'react'
import NextLink from 'next/link'

export default function ResetPasswordPage() {
  const [email, setEmail] = useState('')
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // Add logic to send a password reset email
    console.log('Reset password for:', email)
    router.push('/auth/login') // Redirect to login page after submission
  }

  return (
    <Container maxW="md" py={12}>
      <Box bg="white" p={8} rounded="lg" shadow="md">
        <Heading as="h1" size="xl" mb={6} textAlign="center">
          Reset Password
        </Heading>
        <VStack as="form" spacing={4} onSubmit={handleSubmit}>
          <FormControl>
            <FormLabel>Email</FormLabel>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
            />
          </FormControl>
          <Button type="submit" colorScheme="blue" w="full">
            Send Reset Link
          </Button>
        </VStack>
        <Text mt={4} textAlign="center">
          Remember your password?{' '}
          <Link as={NextLink} href="/auth/login" color="blue.500">
            Login
          </Link>
        </Text>
      </Box>
    </Container>
  )
}
