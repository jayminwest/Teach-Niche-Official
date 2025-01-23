import { ReactNode } from 'react'
import { Box, Container } from '@chakra-ui/react'
import Header from './Header'
import dynamic from 'next/dynamic'
const Hero = dynamic(() => import('./Hero'), { ssr: false })

type LayoutProps = {
  children: ReactNode
  showHero?: boolean
  showHeader?: boolean
  headerProps?: Record<string, unknown>
}

const Layout = ({ children, showHero = false, showHeader = true, headerProps = {} }: LayoutProps) => {
  return (
    <Box minH="100vh" display="flex" flexDirection="column">
      {showHeader !== false && <Header {...headerProps} />}
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
