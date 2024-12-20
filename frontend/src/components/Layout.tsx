import { ReactNode } from 'react'
import { Box, Container } from '@chakra-ui/react'
import Header from './Header'
import Hero from './Hero'

type LayoutProps = {
  children: ReactNode
  showHero?: boolean
}

const Layout = ({ children, showHero = false }: LayoutProps) => {
  return (
    <Box minH="100vh">
      <Header />
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