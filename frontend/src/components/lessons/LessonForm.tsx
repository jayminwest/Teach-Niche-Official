import React from 'react';
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
import { useFormik } from 'formik';
import * as Yup from 'yup';

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
  const formik = useFormik({
    initialValues: {
      title: '',
      description: '',
      price: 0,
      videoFile: undefined,
      thumbnailFile: undefined,
    },
    validationSchema: Yup.object({
      title: Yup.string().required('Title is required'),
      description: Yup.string().required('Description is required'),
      price: Yup.number().required('Price is required').positive('Price must be positive'),
      videoFile: Yup.mixed().optional(), // Adjust validation as needed for file types/sizes
      thumbnailFile: Yup.mixed().optional(), // Adjust validation as needed for file types/sizes
    }),
    onSubmit: onSubmit,
  });

  return (
    <Box as="form" onSubmit={formik.handleSubmit} bg="white" p={6} rounded="md" shadow="md">
      <Stack spacing={4}>
        <FormControl id="title" isInvalid={formik.errors.title && formik.touched.title}>
          <FormLabel>Title</FormLabel>
          <Input
            type="text"
            name="title"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.title}
          />
          {formik.errors.title && formik.touched.title ? (
            <Text color="red.500">{formik.errors.title}</Text>
          ) : null}
        </FormControl>

        <FormControl id="description" isInvalid={formik.errors.description && formik.touched.description}>
          <FormLabel>Description</FormLabel>
          <Textarea
            name="description"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.description}
          />
          {formik.errors.description && formik.touched.description ? (
            <Text color="red.500">{formik.errors.description}</Text>
          ) : null}
        </FormControl>

        <FormControl id="price" isInvalid={formik.errors.price && formik.touched.price}>
          <FormLabel>Price</FormLabel>
          <NumberInput min={0} step={1} precision={2}>
            <NumberInputField
              name="price"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.price}
            />
          </NumberInput>
          {formik.errors.price && formik.touched.price ? (
            <Text color="red.500">{formik.errors.price}</Text>
          ) : null}
        </FormControl>

        <FormControl id="videoFile" >
          <FormLabel>Video File</FormLabel>
          <Input
            type="file"
            name="videoFile"
            onChange={(event) => formik.setFieldValue("videoFile", event.currentTarget.files![0])}
            onBlur={formik.handleBlur}
          />
        </FormControl>

        <FormControl id="thumbnailFile">
          <FormLabel>Thumbnail File</FormLabel>
          <Input
            type="file"
            name="thumbnailFile"
            onChange={(event) => formik.setFieldValue("thumbnailFile", event.currentTarget.files![0])}
            onBlur={formik.handleBlur}
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
