'use client'

import {
  Box,
  Flex,
  Heading,
  Text,
  Badge,
  useColorModeValue,
  Icon,
  Button,
} from '@chakra-ui/react'
import { FiShoppingCart, FiPlay } from 'react-icons/fi'
import { Card } from './Card'

interface LessonCardProps {
  id: string
  title: string
  description: string
  price?: number
  isPurchased?: boolean
  purchasedAt?: string
  isNew?: boolean
  onPurchaseClick?: () => void
  onPlayClick?: () => void
}

export const LessonCard = ({
  title,
  description,
  price,
  isPurchased,
  purchasedAt,
  isNew,
  onPurchaseClick,
  onPlayClick,
}: LessonCardProps) => {
  const textColor = useColorModeValue('gray.600', 'gray.300')
  const priceColor = useColorModeValue('gray.800', 'white')

  return (
    <Card hoverable>
      <Box position="relative">
        {isNew && (
          <Badge
            position="absolute"
            top={2}
            right={2}
            colorScheme="green"
            variant="solid"
            rounded="full"
            px={2}
          >
            New
          </Badge>
        )}

        <Flex direction="column" gap={3}>
          <Heading as="h3" size="md" noOfLines={2}>
            {title}
          </Heading>
          
          <Text color={textColor} noOfLines={3}>
            {description}
          </Text>

          <Flex justify="space-between" align="center" mt={2}>
            {isPurchased ? (
              <>
                <Text fontSize="sm" color={textColor}>
                  Purchased: {new Date(purchasedAt!).toLocaleDateString()}
                </Text>
                <Button
                  leftIcon={<Icon as={FiPlay} />}
                  colorScheme="blue"
                  variant="solid"
                  onClick={onPlayClick}
                >
                  Watch
                </Button>
              </>
            ) : (
              <>
                <Text fontSize="xl" fontWeight="bold" color={priceColor}>
                  ${price?.toFixed(2)}
                </Text>
                <Button
                  leftIcon={<Icon as={FiShoppingCart} />}
                  colorScheme="blue"
                  variant="solid"
                  onClick={onPurchaseClick}
                >
                  Purchase
                </Button>
              </>
            )}
          </Flex>
        </Flex>
      </Box>
    </Card>
  )
}
