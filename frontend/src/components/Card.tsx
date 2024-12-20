import { Box, type BoxProps } from '@chakra-ui/react'

interface CardProps extends BoxProps {
  children: React.ReactNode
  hoverable?: boolean
}

export const Card = ({ children, hoverable = false, ...props }: CardProps) => {
  return (
    <Box
      bg="white"
      p={6}
      rounded="lg"
      shadow="sm"
      transition="all 0.2s"
      _hover={hoverable ? { shadow: 'md', transform: 'translateY(-2px)' } : undefined}
      {...props}
    >
      {children}
    </Box>
  )
} 