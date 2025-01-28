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
  Image,
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
  imageUrl?: string
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
  imageUrl = 'https://images.unsplash.com/photo-1736943993933-c1a407ed783c',
  onPurchaseClick,
  onPlayClick,
}: LessonCardProps) => {
  const textColor = useColorModeValue('gray.600', 'gray.300')
  const priceColor = useColorModeValue('gray.800', 'white')

  return (
    <Card hoverable height="500px">
      <Box position="relative" height="100%" display="flex" flexDirection="column">
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

        <Image
          src={imageUrl}
          alt={title}
          height="225px"
          width="100%"
          objectFit="cover"
          borderRadius="md"
          mb={4}
        />
        <Flex direction="column" gap={3} flex={1}>
          <Heading as="h3" size="md" noOfLines={2}>
            {title}
          </Heading>
          
          <Text color={textColor} noOfLines={3} minHeight="72px">
            {description}
          </Text>

          <Flex justify="space-between" align="center" mt="auto">
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
