import { Container, Box, Heading, Text, Link, useColorModeValue, useToast } from '@chakra-ui/react'
import { AuthForm } from '../../components/auth/AuthForm'
import NextLink from 'next/link'
import { useRouter } from 'next/router'
import { useAuth } from '../../context/AuthContext'

export default function SignupPage() {
  const toast = useToast()
  const router = useRouter()
  const { signUp, isLoading } = useAuth()

  const handleSignup = async (email: string, password: string) => {
    try {
      await signUp(email, password)
      toast({
        title: 'Sign up successful',
        description: 'Please check your email to confirm your account.',
        status: 'success',
        duration: 5000,
        isClosable: true,
      })
      router.push('/auth/confirm')
    } catch (error) {
      toast({
        title: 'Sign up failed',
        description: error instanceof Error ? error.message : 'An error occurred',
        status: 'error',
        duration: 5000,
        isClosable: true,
      })
    }
  }

  return (
    <Container maxW="md" py={12}>
      <Box bg={useColorModeValue('white', 'gray.700')} p={8} rounded="lg" shadow="md">
        <Heading as="h1" size="xl" mb={6} textAlign="center" color={useColorModeValue('gray.800', 'white')}>
          Sign Up
        </Heading>
        <AuthForm 
          type="signup" 
          onSubmit={handleSignup}
          isLoading={isLoading}
        />
        <Text mt={4} textAlign="center">
          Already have an account?{' '}
          <Link as={NextLink} href="/auth/login" color="blue.500">
            Login
          </Link>
        </Text>
      </Box>
    </Container>
  )
}
