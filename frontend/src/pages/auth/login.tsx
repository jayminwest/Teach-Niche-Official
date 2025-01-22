import { Box, Container, Heading, Text, Link } from '@chakra-ui/react'
import { AuthForm } from '../../components/auth/AuthForm'
import NextLink from 'next/link'

export default function LoginPage() {
  return (
    <Container maxW="md" py={12}>
      <Box bg="white" p={8} rounded="lg" shadow="md">
        <Heading as="h1" size="xl" mb={6} textAlign="center">
          Login
        </Heading>
        <AuthForm type="login" />
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
