import { Box, Heading, Text, Accordion, AccordionItem, AccordionButton, AccordionPanel, VStack } from '@chakra-ui/react'
import NextLink from 'next/link'
import Footer from '../components/Footer'
import Layout from '../components/Layout'

const LegalPage = () => {
  return (
    <Layout showHeader={true} showFooter={true}>
      <Box maxW="7xl" mx="auto" px={4} py={12}>
        <Heading as="h1" mb={8} textAlign="center">
          Legal Information
        </Heading>

        <Accordion allowMultiple defaultIndex={[0]}>
          <AccordionItem border="none">
            <AccordionButton _expanded={{ bg: 'gray.50' }} px={0}>
              <Heading as="h2" size="md" flex="1" textAlign="left">
                Terms of Service
              </Heading>
            </AccordionButton>
            <AccordionPanel px={0}>
              <VStack spacing={4} align="start">
                <Text>
                  Welcome to LearnPlatform! These terms outline your rights and responsibilities when using our services.
                </Text>
                {/* Add full terms content here */}
              </VStack>
            </AccordionPanel>
          </AccordionItem>

          <AccordionItem border="none">
            <AccordionButton _expanded={{ bg: 'gray.50' }} px={0}>
              <Heading as="h2" size="md" flex="1" textAlign="left">
                Privacy Policy
              </Heading>
            </AccordionButton>
            <AccordionPanel px={0}>
              <VStack spacing={4} align="start">
                <Text>
                  We are committed to protecting your personal information and your right to privacy.
                </Text>
                {/* Add full privacy policy content here */}
              </VStack>
            </AccordionPanel>
          </AccordionItem>
        </Accordion>
      </Box>
    </Layout>
  )
}

export default LegalPage
