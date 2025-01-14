import { NextPage } from 'next'
import { Heading, Text, VStack, Box, useColorModeValue } from '@chakra-ui/react'
import Layout from '../components/Layout'

interface AboutProps {
  showHero?: boolean
}

const About: NextPage<AboutProps> = ({ showHero = false }) => {
  const textColor = useColorModeValue('gray.600', 'gray.400')

  return (
    <Layout showHero={showHero}>
      <VStack spacing={{ base: 6, md: 8 }} align="stretch">
        <Box>
          <Heading 
            size={{ base: "xl", md: "2xl" }} 
            mb={{ base: 2, md: 4 }}
          >
            About Us
          </Heading>
          <Text fontSize={{ base: "md", md: "lg" }} color={textColor}>
            Learn more about our mission and team.
          </Text>
        </Box>
      </VStack>
    </Layout>
  )
}

About.defaultProps = {
  showHero: false
}

export default About
