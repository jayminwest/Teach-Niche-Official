import { Box, Container, Flex, Link, Text } from '@chakra-ui/react'
import NextLink from 'next/link'

const Footer = () => {
  return (
    <Box 
      as="footer" 
      bg="gray.800" 
      color="white" 
      py={8} 
      mt="auto"
      borderTopWidth="1px"
      borderTopColor="gray.600"
    >
      <Container maxW="7xl">
        <Flex
          direction={{ base: 'column', md: 'row' }}
          justify="space-between"
          align="center"
          gap={6}
        >
          <Flex gap={4} wrap="wrap" justify="center">
            <Link as={NextLink} href="/about" _hover={{ color: 'blue.300' }}>
              About
            </Link>
            <Link as={NextLink} href="/legal#terms" _hover={{ color: 'blue.300' }}>
              Terms
            </Link>
            <Link as={NextLink} href="/legal#privacy" _hover={{ color: 'blue.300' }}>
              Privacy
            </Link>
          </Flex>

          <Text textAlign="center" opacity={0.8}>
            © {new Date().getFullYear()} LearnPlatform. All rights reserved.
          </Text>

          <Flex gap={4}>
            <Link href="https://twitter.com" isExternal _hover={{ color: 'blue.300' }}>
              Twitter
            </Link>
            <Link href="https://facebook.com" isExternal _hover={{ color: 'blue.300' }}>
              Facebook
            </Link>
          </Flex>
        </Flex>
      </Container>
    </Box>
  )
}

export default Footer
