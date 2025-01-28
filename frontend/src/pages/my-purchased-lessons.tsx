import { Text, VStack } from '@chakra-ui/react';
import Layout from '../components/Layout';
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { LessonCard } from '../components/LessonCard';

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

  const handlePlayClick = (lessonId: string) => {
    // TODO: Implement video playback navigation
    console.log('Play lesson:', lessonId);
  };

  return (
    <Layout showHeader={false} showHero={false}>
      <VStack spacing={{ base: 6, md: 8 }} align="stretch" pt={4}>
        {loading ? (
          <Text>Loading...</Text>
        ) : lessons.length > 0 ? (
          <VStack spacing={4} align="stretch">
            {lessons.map((lesson) => (
              <LessonCard
                key={lesson.id}
                id={lesson.id}
                title={lesson.title}
                description={lesson.description}
                isPurchased={true}
                purchasedAt={lesson.purchased_at}
                onPlayClick={() => handlePlayClick(lesson.id)}
              />
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
