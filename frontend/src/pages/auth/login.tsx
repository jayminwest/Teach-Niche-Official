import { Box, Container, Heading, Text, Link, useColorModeValue, useToast } from '@chakra-ui/react'
import { AuthForm } from '../../components/auth/AuthForm'
import NextLink from 'next/link'
import { useRouter } from 'next/router'
import { useAuth } from '../../context/AuthContext'

export default function LoginPage() {
  const toast = useToast()
  const router = useRouter()
  const { signIn, isLoading } = useAuth()

  const handleLogin = async (email: string, password: string) => {
    try {
      await signIn(email, password)
      toast({
        title: 'Login successful',
        status: 'success',
        duration: 3000,
        isClosable: true,
      })
      router.push('/profile')
    } catch (error) {
      toast({
        title: 'Login failed',
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
          Login
        </Heading>
        <AuthForm 
          type="login" 
          onSubmit={handleLogin}
          isLoading={isLoading}
        />
        <Text mt={4} textAlign="center">
          Don&apos;t have an account?{' '}
          <Link as={NextLink} href="/auth/signup" color="blue.500">
            Sign up
          </Link>
        </Text>
      </Box>
    </Container>
  )
}
