import Link from 'next/link'
import { useAuth } from '../context/AuthContext'
import {
  Box,
  Flex,
  Button,
  Text,
  VStack,
  useDisclosure,
  IconButton,
  Container,
  HStack,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerContent,
  DrawerOverlay,
  DrawerCloseButton,
} from '@chakra-ui/react'
import { useColorMode } from '@chakra-ui/color-mode'
import { FiUser, FiMoon, FiSun, FiMenu } from 'react-icons/fi'

type NavItem = {
  href: string
  label: string
}

const NAV_ITEMS: NavItem[] = [
  { href: '/', label: 'Home' },
  { href: '/lessons', label: 'Lessons' },
  { href: '/about', label: 'About' },
  { href: '/my-purchased-lessons', label: 'My Purchased Lessons' },
] as const


const Header = () => {
  const { isOpen: isMenuOpen, onToggle: onMenuToggle, onClose: onMenuClose } = useDisclosure()
  const { isOpen: isProfileOpen, onToggle: onProfileToggle } = useDisclosure()
  const { colorMode, toggleColorMode } = useColorMode()
  const { user, signOut } = useAuth()

  return (
    <Box 
      as="header" 
      w="full" 
      borderBottomWidth="1px" 
      bg="white" 
      _dark={{
        bg: 'gray.800',
        borderBottomColor: 'gray.600',
      }}
    >
      <Container maxW="7xl">
        <Flex h="16" align="center" justify="space-between">
          <Link href="/" passHref>
            <Text 
              fontSize={{ base: "lg", md: "xl" }} 
              fontWeight="semibold"
              _dark={{ color: 'white' }}
            >
              Teach Niche
            </Text>
          </Link>

          {/* Desktop Navigation */}
          <Flex 
            as="nav" 
            display={{ base: 'none', md: 'flex' }} 
            flex={1} 
            justify="center" 
            gap={6}
          >
            {NAV_ITEMS.map(({ href, label }) => (
              <Link key={href} href={href}>
                <Button variant="ghost">
                  {label}
                </Button>
              </Link>
            ))}
          </Flex>

          <HStack spacing={2}>
            <IconButton
              icon={colorMode === 'light' ? <FiMoon /> : <FiSun />}
              variant="ghost"
              rounded="full"
              aria-label={`Toggle ${colorMode === 'light' ? 'dark' : 'light'} mode`}
              onClick={toggleColorMode}
            />
            
            {/* Desktop Profile Menu */}
            <Box display={{ base: 'none', md: 'block' }}>
              <Menu isOpen={isProfileOpen} onClose={onProfileToggle}>
                <MenuButton
                  as={Button}
                  variant="ghost"
                  rounded="full"
                  aria-label="User menu"
                  onClick={onProfileToggle}
                  leftIcon={<FiUser />}
                >
                  <HStack spacing={2} minW="100px" maxW="200px" justify="space-between">
                    {user ? (
                      <>
                        <Text fontSize="sm" maxW="160px" isTruncated>
                          {user.email}
                        </Text>
                        <Box w={2} h={2} bg="green.400" rounded="full" flexShrink={0} />
                      </>
                    ) : (
                      'Sign In'
                    )}
                  </HStack>
                </MenuButton>
                <MenuList>
                  {user ? (
                    <>
                      <MenuItem as={Link} href="/profile">Profile</MenuItem>
                      <MenuItem onClick={signOut}>Logout</MenuItem>
                    </>
                  ) : (
                    <>
                      <MenuItem as={Link} href="/auth/login">Login</MenuItem>
                      <MenuItem as={Link} href="/auth/signup">Sign Up</MenuItem>
                    </>
                  )}
                </MenuList>
              </Menu>
            </Box>

            {/* Mobile Menu Button */}
            <IconButton
              display={{ base: 'flex', md: 'none' }}
              icon={<FiMenu />}
              variant="ghost"
              aria-label="Open menu"
              onClick={onMenuToggle}
            />
          </HStack>
        </Flex>
      </Container>

      {/* Mobile Navigation Drawer */}
      <Drawer isOpen={isMenuOpen} placement="right" onClose={onMenuClose}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>Menu</DrawerHeader>
          <DrawerBody>
            <VStack spacing={4} align="stretch">
              {NAV_ITEMS.map(({ href, label }) => (
                <Link key={href} href={href}>
                  <Button w="full" variant="ghost" onClick={onMenuClose}>
                    {label}
                  </Button>
                </Link>
              ))}
              <Box pt={4} borderTopWidth={1}>
                {user ? (
                  <>
                    <Link href="/profile">
                      <Button w="full" variant="ghost" onClick={onMenuClose}>
                        Profile
                      </Button>
                    </Link>
                    <Button 
                      w="full" 
                      variant="ghost" 
                      onClick={() => {
                        signOut()
                        onMenuClose()
                      }}
                    >
                      Logout
                    </Button>
                  </>
                ) : (
                  <>
                    <Link href="/auth/login">
                      <Button w="full" variant="ghost" onClick={onMenuClose}>
                        Login
                      </Button>
                    </Link>
                    <Link href="/auth/signup">
                      <Button w="full" variant="ghost" onClick={onMenuClose}>
                        Sign Up
                      </Button>
                    </Link>
                  </>
                )}
              </Box>
            </VStack>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </Box>
  )
}

export default Header 
