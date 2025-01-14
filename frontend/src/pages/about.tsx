import { NextPage } from 'next'
import { Heading, Text, VStack, Box, useColorModeValue } from '@chakra-ui/react'
import Layout from '../components/Layout'

interface AboutProps {
  showHero?: boolean
}

const About: NextPage<AboutProps> = ({ showHero = false }) => {
  const textColor = useColorModeValue('gray.600', 'gray.400')

  return (
    <Layout showHeader showHero={false}>
      <VStack spacing={{ base: 6, md: 8 }} align="stretch" pt={4}>
        <Text fontSize={{ base: "md", md: "lg" }} color={textColor}>
          Learn more about our mission and team.
        </Text>
      </VStack>
    </Layout>
  )
}

About.defaultProps = {
  showHero: false
}

export default About
