import { Progress, Button, HStack } from '@chakra-ui/react'

interface VideoUploadProgressProps {
  progress: number
  onCancel: () => void
}

export const VideoUploadProgress = ({
  progress,
  onCancel
}: VideoUploadProgressProps) => {
  return (
    <HStack spacing={4} mt={2}>
      <Progress value={progress} flex="1" size="sm" isAnimated />
      <Button size="sm" onClick={onCancel}>
        Cancel
      </Button>
    </HStack>
  )
}
