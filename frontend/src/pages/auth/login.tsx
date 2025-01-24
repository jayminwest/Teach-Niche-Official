import { Box, Container, Heading, Text, Link, useColorModeValue } from '@chakra-ui/react'
import { AuthForm } from '../../components/auth/AuthForm'
import NextLink from 'next/link'

export default function LoginPage() {
  return (
    <Container maxW="md" py={12}>
      <Box bg={useColorModeValue('white', 'gray.700')} p={8} rounded="lg" shadow="md">
        <Heading as="h1" size="xl" mb={6} textAlign="center" color={useColorModeValue('gray.800', 'white')}>
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
