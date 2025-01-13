import type { AppProps } from 'next/app'
import { ChakraProvider, extendTheme } from '@chakra-ui/react'
import { ColorModeScript } from '@chakra-ui/react'
import Layout from '../components/Layout'

const theme = extendTheme({
  config: {
    initialColorMode: 'light',
    useSystemColorMode: false,
  },
  styles: {
    global: ({ colorMode }) => ({
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

export default function App({ Component, pageProps, router }: AppProps) {
  // Add error boundary for better error handling
  const [hasError, setHasError] = React.useState(false)

  React.useEffect(() => {
    const handleRouteChange = () => {
      setHasError(false)
    }

    router.events.on('routeChangeComplete', handleRouteChange)
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange)
    }
  }, [router])

  return (
    <ChakraProvider theme={theme}>
      <ColorModeScript initialColorMode={theme.config.initialColorMode} />
      <Layout>
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
          <Component {...pageProps} />
        )}
      </Layout>
    </ChakraProvider>
  )
} 
