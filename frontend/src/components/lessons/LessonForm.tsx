import React, { useState } from 'react';
import {
  FormControl,
  FormLabel,
  Input,
  Textarea,
  NumberInput,
  NumberInputField,
  Button,
  Stack,
  Box,
  Flex,
  Text,
} from '@chakra-ui/react';

interface LessonFormProps {
  onSubmit: (values: {
    title: string;
    description: string;
    price: number;
    videoFile?: File;
    thumbnailFile?: File;
  }) => void;
  isSubmitting: boolean;
}

export const LessonForm: React.FC<LessonFormProps> = ({ onSubmit, isSubmitting }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState<number | undefined>(0);
  const [videoFile, setVideoFile] = useState<File | undefined>(undefined);
  const [thumbnailFile, setThumbnailFile] = useState<File | undefined>(undefined);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (price === undefined) {
      // Basic validation, consider more robust validation
      alert("Price is required and must be a positive number");
      return;
    }

    onSubmit({
      title,
      description,
      price: price,
      videoFile,
      thumbnailFile,
    });
  };

  return (
    <Box as="form" onSubmit={handleSubmit} bg="white" p={6} rounded="md" shadow="md">
      <Stack spacing={4}>
        <FormControl id="title">
          <FormLabel>Title</FormLabel>
          <Input
            type="text"
            name="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </FormControl>

        <FormControl id="description">
          <FormLabel>Description</FormLabel>
          <Textarea
            name="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </FormControl>

        <FormControl id="price">
          <FormLabel>Price</FormLabel>
          <NumberInput min={0} step={1} precision={2} value={price} onChange={(valueString) => setPrice(parseFloat(valueString))}>
            <NumberInputField
              name="price"
            />
          </NumberInput>
        </FormControl>

        <FormControl id="videoFile" >
          <FormLabel>Video File</FormLabel>
          <Input
            type="file"
            name="videoFile"
            onChange={(event) => setVideoFile(event.currentTarget.files![0])}
          />
        </FormControl>

        <FormControl id="thumbnailFile">
          <FormLabel>Thumbnail File</FormLabel>
          <Input
            type="file"
            name="thumbnailFile"
            onChange={(event) => setThumbnailFile(event.currentTarget.files![0])}
          />
        </FormControl>


        <Flex justify="flex-end">
          <Button colorScheme="blue" type="submit" isLoading={isSubmitting}>
            Create Lesson
          </Button>
        </Flex>
      </Stack>
    </Box>
  );
};
