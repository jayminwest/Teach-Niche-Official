import { Box, type BoxProps, useColorModeValue } from '@chakra-ui/react'
import React from 'react'

interface CardProps extends BoxProps {
  children: React.ReactNode
  hoverable?: boolean
}

export const Card = ({ children, hoverable = false, ...props }: CardProps) => {
  const bgColor = useColorModeValue('white', 'gray.700')
  const hoverBg = useColorModeValue('gray.50', 'gray.600')
  
  return (
    <Box
      bg={bgColor}
      p={6}
      rounded="lg"
      shadow="sm"
      borderWidth="1px"
      borderColor={useColorModeValue('gray.200', 'gray.600')}
      transition="all 0.2s"
      _hover={hoverable ? { 
        shadow: 'md', 
        transform: 'translateY(-2px)',
        bg: hoverBg
      } : undefined}
      {...props}
    >
      {children}
    </Box>
  )
}
