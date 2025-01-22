import type { AppProps } from 'next/app'
import React from 'react'
import { ChakraProvider, extendTheme, Box, Heading, Text, Button } from '@chakra-ui/react'
import { AuthProvider } from '../context/AuthContext'
import { ColorModeScript } from '@chakra-ui/react'
import Layout from '../components/Layout'

const theme = extendTheme({
  config: {
    initialColorMode: 'light',
    useSystemColorMode: false,
  },
  styles: {
    global: ({ colorMode }: { colorMode: 'light' | 'dark' }) => ({
      body: {
        bg: colorMode === 'light' ? 'gray.50' : 'gray.800',
      },
    }),
  },
  breakpoints: {
    sm: '30em',    // 480px
    md: '48em',    // 768px
    lg: '62em',    // 992px
    xl: '80em',    // 1280px
    '2xl': '96em', // 1536px
  },
  components: {
    Container: {
      baseStyle: {
        maxW: '7xl',
        px: { base: 4, md: 6 },
      },
    },
    Button: {
      baseStyle: {
        fontWeight: 'normal',
      },
    },
  },
})

class ErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean }> {
  constructor(props: { children: React.ReactNode }) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <Box textAlign="center" py={10} px={6}>
          <Heading as="h2" size="xl" mt={6} mb={2}>
            Something went wrong
          </Heading>
          <Text color={'gray.500'} mb={4}>
            We're sorry for the inconvenience. Please try refreshing the page.
          </Text>
          <Button
            colorScheme="blue"
            onClick={() => window.location.reload()}
          >
            Refresh Page
          </Button>
        </Box>
      )
    }

    return this.props.children
  }
}

export default function App({ Component, pageProps, router }: AppProps) {
  // Add error boundary for better error handling
  const [hasError, setHasError] = React.useState(false)

  React.useEffect(() => {
    const handleRouteChange = () => {
      setHasError(false)
    }

    const handleError = (error: Error) => {
      console.error('Application error:', error)
      setHasError(true)
    }

    router.events.on('routeChangeComplete', handleRouteChange)
    window.addEventListener('error', handleError)
    
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange)
      window.removeEventListener('error', handleError)
    }
  }, [router])

  return (
    <ChakraProvider theme={theme}>
      <ColorModeScript initialColorMode={theme.config.initialColorMode} />
      <AuthProvider>
        <ErrorBoundary>
        {hasError ? (
          <Box textAlign="center" py={10} px={6}>
            <Heading as="h2" size="xl" mt={6} mb={2}>
              Something went wrong
            </Heading>
            <Text color={'gray.500'}>
              Please try refreshing the page or navigating back to the homepage.
            </Text>
          </Box>
        ) : (
          <Layout showHeader={!hasError} showHero={pageProps.showHero}>
            <Component {...pageProps} />
          </Layout>
        )}
        </ErrorBoundary>
      </AuthProvider>
    </ChakraProvider>
  )
} 
