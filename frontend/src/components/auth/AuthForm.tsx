import { useState } from 'react'
import { Box, Button, FormControl, FormErrorMessage, FormLabel, Input, Stack, Text, Link } from '@chakra-ui/react'
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
      if (type === 'login') {
        const { error } = await signIn(email, password)
        if (error) throw error
      } else {
        const { error } = await signUp(email, password)
        if (error) throw error
      }
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : 'An error occurred. Please try again.')
    }
  }

  return (
    <Box as="form" onSubmit={handleSubmit}>
      <Stack spacing={4}>
        <FormControl isInvalid={!!error}>
          <FormLabel>Email</FormLabel>
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </FormControl>

        <FormControl isInvalid={!!error}>
          <FormLabel>Password</FormLabel>
          <Input
            type="password"
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
