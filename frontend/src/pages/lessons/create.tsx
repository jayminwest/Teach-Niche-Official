import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import {
  Container,
  Heading,
  Box,
  useToast,
  Text,
  Spinner,
} from '@chakra-ui/react';
import { LessonForm } from '../../components/lessons/LessonForm';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../lib/supabase';

const LessonCreatePage = () => {
  const { user, profile, loading: authLoading } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const toast = useToast();

  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        router.push('/auth/login'); // Redirect to login if not authenticated
      } else if (profile?.stripe_account_id === null || profile?.stripe_onboarding_complete === false) {
        router.push('/profile'); // Redirect to profile to connect Stripe
      } else {
        setIsLoading(false); // Only set loading to false if user is authenticated and Stripe is connected
      }
    }
  }, [user, profile, authLoading, router]);

  const handleSubmit = async (values: {
    title: string;
    description: string;
    price: number;
    videoFile?: File;
    thumbnailFile?: File;
  }) => {
    setIsSubmitting(true);
    try {
      // 1. Upload video to Vimeo (if videoFile is present)
      let vimeoVideoId: string | null = null;
      if (values.videoFile) {
        // TODO: Implement Vimeo upload logic here
        // This is a placeholder, replace with actual Vimeo upload
        console.log('Uploading video to Vimeo...', values.videoFile);
        //Simulate upload
        await new Promise((resolve) => setTimeout(resolve, 2000));
        vimeoVideoId = '12345'; // Replace with actual Vimeo video ID
      }

      // 2. Upload thumbnail to Supabase storage (if thumbnailFile is present)
      let thumbnailUrl: string | null = null;
      if (values.thumbnailFile) {
        const { data, error } = await supabase.storage
          .from('lesson-thumbnails')
          .upload(`${user.id}/${Date.now()}-${values.thumbnailFile.name}`, values.thumbnailFile, {
            cacheControl: '3600',
            upsert: false,
          });

        if (error) {
          throw new Error(`Error uploading thumbnail: ${error.message}`);
        }

        thumbnailUrl = supabase.storage.from('lesson-thumbnails').getPublicUrl(data.path).data.publicUrl;
      }

      // 3. Create lesson via backend API
      const response = await fetch('/api/lessons', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: values.title,
          description: values.description,
          price: values.price,
          video_id: vimeoVideoId,
          thumbnail_url: thumbnailUrl,
          stripe_account_id: profile?.stripe_account_id,
          creator_id: user.id,
        }),
      });

      if (!response.ok) {
        const message = (await response.json()).detail;
        throw new Error(`Failed to create lesson: ${message || response.statusText}`);
      }

      const lessonData = await response.json();


      toast({
        title: 'Lesson created.',
        description: 'Your lesson has been created successfully.',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });

      router.push(`/lessons/${lessonData.id}`); // Redirect to the new lesson page
    } catch (error: any) {
      console.error('Error creating lesson:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to create lesson',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <Container maxW="container.md" py={10}>
        <Box textAlign="center">
          <Spinner size="lg" />
          <Text mt={2}>Loading...</Text>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxW="container.md" py={10}>
      <Heading as="h1" mb={6}>
        Create a New Lesson
      </Heading>
      <LessonForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />
    </Container>
  );
};

export default LessonCreatePage;
