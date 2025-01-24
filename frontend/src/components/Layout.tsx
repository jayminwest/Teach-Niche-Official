import { ReactNode } from 'react'
import { Box, Container } from '@chakra-ui/react'
import Header from './Header'
import Footer from './Footer'
import dynamic from 'next/dynamic'
const Hero = dynamic(() => import('./Hero'), { ssr: false })

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
