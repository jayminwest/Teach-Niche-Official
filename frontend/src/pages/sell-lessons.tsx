import { NextPage } from 'next'
import { 
  Box, 
  Container, 
  Heading, 
  Text, 
  VStack, 
  SimpleGrid, 
  useColorModeValue,
  Avatar,
  Stack
} from '@chakra-ui/react'
import Layout from '../components/Layout'

const SellLessonsPage: NextPage = () => {
  const textColor = useColorModeValue('gray.600', 'gray.400')
  const headingColor = useColorModeValue('blue.600', 'blue.400')
  const cardBg = useColorModeValue('white', 'gray.700')

  const teamMembers = [
    {
      name: 'Alice Johnson',
      role: 'Curriculum Specialist',
      bio: 'Expert in designing engaging lesson plans.',
      avatar: 'https://example.com/alice-johnson.jpg' // Replace with actual URL
    },
    {
      name: 'Bob Williams',
      role: 'Marketing Strategist',
      bio: 'Specializes in reaching a wide audience of learners.',
      avatar: 'https://example.com/bob-williams.jpg' // Replace with actual URL
    }
  ]

  return (
    <Layout showHeader={false} showHero={false} showFooter={false}>
      <Container maxW="container.lg" py={12}>
        {/* Mission Section */}
        <VStack spacing={8} align="stretch" mb={16}>
          <Heading as="h1" size="2xl" color={headingColor} textAlign="center">
            Empowering Educators
          </Heading>
          <Box display="flex" justifyContent="center" w="100%">
            <Text fontSize="xl" color={textColor} textAlign="center" maxW="2xl" width="100%">
              We provide a platform for educators to share their knowledge and connect with learners around the world. Our mission is to empower educators to monetize their expertise and create engaging learning experiences.
            </Text>
          </Box>
        </VStack>

        {/* Values Section */}
        <Box mb={16}>
          <Heading as="h2" size="xl" color={headingColor} mb={8} textAlign="center">
            Our Promises
          </Heading>
          <SimpleGrid columns={{ base: 1, md: 3 }} spacing={8}>
            <Box bg={cardBg} p={6} borderRadius="lg" boxShadow="md">
              <Heading as="h3" size="md" color={headingColor} mb={4}>
                Reach
              </Heading>
              <Text color={textColor}>
                Connect with a global audience of learners eager to expand their knowledge.
              </Text>
            </Box>
            <Box bg={cardBg} p={6} borderRadius="lg" boxShadow="md">
              <Heading as="h3" size="md" color={headingColor} mb={4}>
                Support
              </Heading>
              <Text color={textColor}>
                Receive guidance and resources to create high-quality lessons.
              </Text>
            </Box>
            <Box bg={cardBg} p={6} borderRadius="lg" boxShadow="md">
              <Heading as="h3" size="md" color={headingColor} mb={4}>
                Monetization
              </Heading>
              <Text color={textColor}>
                Earn revenue by sharing your expertise and passion with others.
              </Text>
            </Box>
          </SimpleGrid>
        </Box>

        {/* Team Section */}
        <Box>
          <Heading as="h2" size="xl" color={headingColor} mb={8} textAlign="center">
            Our Team
          </Heading>
          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={10} maxW="2xl" mx="auto">
            {teamMembers.map((member) => (
              <Stack
                key={member.name}
                bg={cardBg}
                p={6}
                borderRadius="lg"
                boxShadow="md"
                spacing={4}
                align="center"
                textAlign="center"
              >
                <Avatar size="xl" name={member.name} src={member.avatar} />
                <Heading as="h3" size="md" color={headingColor}>
                  {member.name}
                </Heading>
                <Text fontWeight="medium" color={textColor}>
                  {member.role}
                </Text>
                <Text color={textColor}>
                  {member.bio}
                </Text>
              </Stack>
            ))}
          </SimpleGrid>
        </Box>
      </Container>
    </Layout>
  )
}

export default SellLessonsPage
