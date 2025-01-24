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

const About: NextPage = () => {
  const textColor = useColorModeValue('gray.600', 'gray.400')
  const headingColor = useColorModeValue('blue.600', 'blue.400')
  const cardBg = useColorModeValue('white', 'gray.700')

  const teamMembers = [
    {
      name: 'John Doe',
      role: 'CEO & Founder',
      bio: 'Visionary leader with 10+ years in edtech',
      avatar: 'https://bit.ly/john-doe'
    },
    {
      name: 'Jane Smith',
      role: 'CTO',
      bio: 'Tech innovator specializing in scalable learning platforms',
      avatar: 'https://bit.ly/jane-smith'
    }
  ]

  return (
    <Layout showHeader={false} showHero={false} showFooter={false}>
      <Container maxW="container.lg" py={12}>
        {/* Mission Section */}
        <VStack spacing={8} align="stretch" mb={16}>
          <Heading as="h1" size="2xl" color={headingColor} textAlign="center">
            Our Mission
          </Heading>
          <Text fontSize="xl" color={textColor} textAlign="center" maxW="2xl" mx="auto">
            We're revolutionizing online education by creating an accessible platform that empowers both learners and creators. Our mission is to bridge the gap between knowledge and opportunity.
          </Text>
        </VStack>

        {/* Values Section */}
        <Box mb={16}>
          <Heading as="h2" size="xl" color={headingColor} mb={8} textAlign="center">
            Core Values
          </Heading>
          <SimpleGrid columns={{ base: 1, md: 3 }} spacing={8}>
            <Box bg={cardBg} p={6} borderRadius="lg" boxShadow="md">
              <Heading as="h3" size="md" color={headingColor} mb={4}>
                Innovation
              </Heading>
              <Text color={textColor}>
                We constantly push boundaries to deliver cutting-edge learning experiences.
              </Text>
            </Box>
            <Box bg={cardBg} p={6} borderRadius="lg" boxShadow="md">
              <Heading as="h3" size="md" color={headingColor} mb={4}>
                Integrity
              </Heading>
              <Text color={textColor}>
                We maintain transparency and honesty in all our operations.
              </Text>
            </Box>
            <Box bg={cardBg} p={6} borderRadius="lg" boxShadow="md">
              <Heading as="h3" size="md" color={headingColor} mb={4}>
                Impact
              </Heading>
              <Text color={textColor}>
                We measure success by the positive change we create in our community.
              </Text>
            </Box>
          </SimpleGrid>
        </Box>

        {/* Team Section */}
        <Box>
          <Heading as="h2" size="xl" color={headingColor} mb={8} textAlign="center">
            Meet Our Team
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

export default About
