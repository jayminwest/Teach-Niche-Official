import { useState } from 'react'
import { Box, Button, FormControl, FormErrorMessage, FormLabel, Input, Stack, Text, Link, useColorModeValue, Divider, HStack } from '@chakra-ui/react'
import { FcGoogle } from 'react-icons/fc'
import { useAuth } from '../../context/AuthContext'

interface AuthFormProps {
  type: 'login' | 'signup'
}

export const AuthForm = ({ type }: AuthFormProps) => {
  const { signIn, signUp, signInWithGoogle, isLoading } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    
    try {
      if (type === 'login') {
        await signIn(email, password)
      } else {
        await signUp(email, password)
      }
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'An error occurred. Please try again.'
      setError(message)
      console.error('Authentication error:', error)
      // Reset form state
      setEmail('')
      setPassword('')
    }
  }

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle()
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'An error occurred. Please try again.'
      setError(message)
      console.error('Google authentication error:', error)
    }
  }

  return (
    <Box as="form" onSubmit={handleSubmit}>
      <Stack spacing={4}>
        <Button
          w="full"
          onClick={handleGoogleSignIn}
          leftIcon={<FcGoogle />}
          variant="outline"
          isLoading={isLoading}
          type="button"
        >
          Continue with Google
        </Button>

        <HStack>
          <Divider />
          <Text fontSize="sm" whiteSpace="nowrap" color="gray.500">
            or continue with email
          </Text>
          <Divider />
        </HStack>
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
