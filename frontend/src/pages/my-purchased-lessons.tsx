import { Box, Heading, Text, VStack } from '@chakra-ui/react';
import Layout from '../components/Layout';
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

interface Lesson {
  id: string;
  title: string;
  description: string;
  purchased_at: string;
}

const MyPurchasedLessonsPage = () => {
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPurchasedLessons = async () => {
      try {
        const { data, error } = await supabase
          .from('purchased_lessons')
          .select('*')
          .order('purchased_at', { ascending: false });

        if (error) throw error;

        setLessons(data || []);
      } catch (error) {
        console.error('Error fetching purchased lessons:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPurchasedLessons();
  }, []);

  return (
    <Layout showHeader={false} showHero={false}>
      <VStack spacing={{ base: 6, md: 8 }} align="stretch" pt={4}>
        {loading ? (
          <Text>Loading...</Text>
        ) : lessons.length > 0 ? (
          <VStack spacing={4} align="start">
            {lessons.map((lesson) => (
              <Box key={lesson.id} p={4} borderWidth="1px" borderRadius="lg" w="100%">
                <Heading as="h2" size="md" mb={2}>
                  {lesson.title}
                </Heading>
                <Text>{lesson.description}</Text>
                <Text fontSize="sm" color="gray.500">
                  Purchased on: {new Date(lesson.purchased_at).toLocaleDateString()}
                </Text>
              </Box>
            ))}
          </VStack>
        ) : (
          <Text>No lessons purchased yet.</Text>
        )}
      </VStack>
    </Layout>
  );
};

export default MyPurchasedLessonsPage;
