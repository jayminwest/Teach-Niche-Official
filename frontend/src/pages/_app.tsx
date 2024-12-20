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

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider theme={theme}>
      <ColorModeScript initialColorMode={theme.config.initialColorMode} />
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </ChakraProvider>
  )
} 