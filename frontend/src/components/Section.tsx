import { VStack, Heading, Text, StackProps } from '@chakra-ui/react'

interface SectionProps extends StackProps {
  title?: string
  subtitle?: string
  children: React.ReactNode
}

export const Section = ({ title, subtitle, children, ...props }: SectionProps) => {
  return (
    <VStack spacing={6} align="stretch" w="full" {...props}>
      {title && (
        <VStack spacing={2} align="start">
          <Heading size="lg">{title}</Heading>
          {subtitle && <Text color="gray.600">{subtitle}</Text>}
        </VStack>
      )}
      {children}
    </VStack>
  )
} 