import { ReactNode } from 'react'
import { Box, Container, Spinner, Center } from '@chakra-ui/react'
import Header from './Header'
import Footer from './Footer'
import { useAuth } from '../context/AuthContext'
import Hero from './Hero'

type LayoutProps = {
  children: ReactNode
  showHero?: boolean
  showHeader?: boolean
  showFooter?: boolean
  headerProps?: Record<string, unknown>
}

const Layout = ({ 
  children, 
  showHero = false, 
  showHeader = true,
  showFooter = true,
  headerProps = {}
}: LayoutProps) => {
  const { isLoading } = useAuth()

  if (isLoading) {
    return (
      <Center minH="100vh">
        <Spinner 
          thickness="4px"
          speed="0.65s"
          emptyColor="gray.200"
          color="blue.500"
          size="xl"
          role="status"
          aria-label="Loading"
        />
      </Center>
    )
  }

  return (
    <Box minH="100vh" display="flex" flexDirection="column">
      {showHeader && <Header {...headerProps} />}
      {showHero && <Hero />}
      <Container 
        as="main" 
        maxW="7xl" 
        px={{ base: 4, md: 6 }}
        py={{ base: 4, md: 8 }}
        flex="1"
      >
        {children}
      </Container>
      {showFooter && <Footer />}
    </Box>
  )
}

export default Layout 
