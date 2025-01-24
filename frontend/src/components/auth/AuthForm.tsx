import { useState } from 'react'
import { Box, Button, FormControl, FormErrorMessage, FormLabel, Input, Stack, Text, Link, useColorModeValue } from '@chakra-ui/react'
import { useAuth } from '../../context/AuthContext'

interface AuthFormProps {
  type: 'login' | 'signup'
}

export const AuthForm = ({ type }: AuthFormProps) => {
  const { signIn, signUp, isLoading } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    
    try {
      // Use absolute URL for API endpoints in production
      const baseUrl = process.env.NODE_ENV === 'production' 
        ? process.env.NEXT_PUBLIC_SITE_URL
        : ''
      const endpoint = `${baseUrl}/api/auth/${type}`
      
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      })

      // Check if response is JSON
      const contentType = response.headers.get('content-type')
      if (!contentType || !contentType.includes('application/json')) {
        const text = await response.text()
        throw new Error(`Unexpected response: ${text}`)
      }

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.details || data.message || 'Authentication failed')
      }

      // Handle successful authentication
      if (type === 'login') {
        const { error } = await signIn(email, password)
        if (error) throw error
      } else {
        const { error } = await signUp(email, password)
        if (error) throw error
      }
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'An error occurred. Please try again.'
      setError(message)
      console.error('Authentication error:', error)
    }
  }

  return (
    <Box as="form" onSubmit={handleSubmit}>
      <Stack spacing={4}>
        <FormControl isInvalid={!!error}>
          <FormLabel color={useColorModeValue('gray.700', 'gray.200')}>Email</FormLabel>
          <Input
            type="email"
            focusBorderColor={useColorModeValue('blue.500', 'blue.300')}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </FormControl>

        <FormControl isInvalid={!!error}>
          <FormLabel color={useColorModeValue('gray.700', 'gray.200')}>Password</FormLabel>
          <Input
            type="password"
            focusBorderColor={useColorModeValue('blue.500', 'blue.300')}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {error && <FormErrorMessage>{error}</FormErrorMessage>}
        </FormControl>

        <Button
          type="submit"
          colorScheme="blue"
          isLoading={isLoading}
          loadingText={type === 'login' ? 'Logging in...' : 'Signing up...'}
        >
          {type === 'login' ? 'Login' : 'Sign Up'}
        </Button>
        {type === 'login' && (
          <Text mt={2} textAlign="center">
            <Link href="/auth/reset-password" color="blue.500">
              Forgot password?
            </Link>
          </Text>
        )}
      </Stack>
    </Box>
  )
}
