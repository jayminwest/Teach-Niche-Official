import { ReactNode } from 'react'
import { Box, Container } from '@chakra-ui/react'
import Header from './Header'
import Hero from './Hero'

type LayoutProps = {
  children: ReactNode
  showHero?: boolean
  showHeader?: boolean
}

const Layout = ({ children, showHero = false, showHeader = true }: LayoutProps) => {
  return (
    <Box minH="100vh">
      {showHeader !== false && <Header />}
      {showHero && <Hero />}
      <Container 
        as="main" 
        maxW="7xl" 
        px={{ base: 4, md: 6 }}
        py={{ base: 4, md: 8 }}
      >
        {children}
      </Container>
    </Box>
  )
}

export default Layout 
