import Link from 'next/link'
import { Box, Flex, Text } from '@chakra-ui/react'

const Header = () => {
  return (
    <Box as="header" w="full" borderBottomWidth="1px" bg="white">
      <Flex h="16" align="center" px={4}>
        <Link href="/" passHref>
          <Text fontSize="xl" fontWeight="bold">
            Teach Niche
          </Text>
        </Link>
      </Flex>
    </Box>
  )
}

export default Header
