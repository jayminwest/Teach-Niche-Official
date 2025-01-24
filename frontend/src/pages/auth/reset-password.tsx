import { Box, Button, Container, FormControl, FormLabel, Heading, Input, Link, Text, VStack, useColorModeValue } from '@chakra-ui/react'
import { useRouter } from 'next/router'
import { useState } from 'react'
import NextLink from 'next/link'
import { useAuth } from '@/context/AuthContext'

export default function ResetPasswordPage() {
  const [email, setEmail] = useState('')
  const router = useRouter()

  const { resetPassword } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    
    try {
      await resetPassword(email)
      setSuccess(true)
      setTimeout(() => {
        router.push('/auth/login')
      }, 3000)
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : 'An unknown error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Container maxW="md" py={12}>
      <Box bg={useColorModeValue('white', 'gray.700')} p={8} rounded="lg" shadow="md">
        <Heading as="h1" size="xl" mb={6} textAlign="center" color={useColorModeValue('gray.800', 'white')}>
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
              _placeholder={{ color: useColorModeValue('gray.500', 'gray.400') }}
            />
          </FormControl>
          <Button 
            type="submit" 
            colorScheme="blue" 
            w="full"
            isLoading={isLoading}
            loadingText="Sending..."
          >
            Send Reset Link
          </Button>
          {error && (
            <Text color={useColorModeValue('red.500', 'red.300')} textAlign="center">
              {error}
            </Text>
          )}
          {success && (
            <Text color={useColorModeValue('green.500', 'green.300')} textAlign="center">
              Password reset email sent! Redirecting to login...
            </Text>
          )}
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
