import { NextPage } from 'next'
import { loadStripe } from '@stripe/stripe-js'
import {
  Box,
  Flex,
  Input,
  Select,
  SimpleGrid,
  ButtonGroup,
  IconButton,
  useColorModeValue,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
} from '@chakra-ui/react'
import { LessonCard } from '../components/LessonCard'
import { useState, useMemo, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabase'
import { useRouter } from 'next/router'
import { BsGrid, BsListUl } from 'react-icons/bs'

interface Lesson {
  id: string;
  title: string;
  description: string;
  price: number;
  created_at: string;
  updated_at: string;
  thumbnail_url?: string;
  stripe_price_id?: string;
  stripe_account_id: string;
  is_featured?: boolean;
  categories?: string[];
  vimeo_video_id?: string;
}

const Lessons: NextPage = () => {
  const { session } = useAuth()
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState('newest')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [purchasedLessons, setPurchasedLessons] = useState<Lesson[]>([])
  const [lessons, setLessons] = useState<Lesson[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [tabIndex, setTabIndex] = useState(0)

  // Pre-calculate all color mode values
  const textColor = useColorModeValue('gray.600', 'gray.400')
  const bgColor = useColorModeValue('gray.50', 'gray.900')
  const inputBgColor = useColorModeValue('white', 'gray.700')
  const selectedButtonBg = useColorModeValue('gray.100', 'gray.600')

  useEffect(() => {
    if (!session) {
      router.push('/auth/login')
    }
  }, [session, router])

  useEffect(() => {
    const fetchLessons = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/lessons`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setLessons(data);
      } catch (error) {
        console.error('Error fetching lessons:', error);
      } finally {
        setIsLoading(false);
      }
    };

    const fetchPurchasedLessons = async () => {
      if (!session) return
      
      try {
        const { data, error } = await supabase
          .from('purchases')
          .select('*')
          .order('purchase_date', { ascending: false });

        if (error) throw error;
        setPurchasedLessons(data || []);
      } catch (error) {
        console.error('Error fetching purchased lessons:', error);
      }
    };

    fetchLessons();
    fetchPurchasedLessons();
  }, [session]);

  const filteredLessons = useMemo(() => {
    let results = tabIndex === 0 
      ? [...lessons] 
      : purchasedLessons.map(purchase => 
          lessons.find(lesson => lesson.id === purchase.lesson_id) || purchase
        ).filter(Boolean);
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      results = results.filter(lesson => 
        lesson.title.toLowerCase().includes(query) ||
        lesson.description.toLowerCase().includes(query)
      );
    }
    
    results.sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'oldest':
          return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
        case 'newest':
        default:
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      }
    });
    
    return results;
  }, [searchQuery, sortBy]);


  const handlePurchaseClick = async (lessonId: string) => {
    console.log('Starting purchase process for lesson:', lessonId);
    const lesson = lessons.find(l => l.id === lessonId);
    if (!lesson) {
      console.error('Purchase error: Lesson not found with ID', lessonId);
      return;
    }
    console.log('Found lesson:', {
      id: lesson.id,
      title: lesson.title,
      stripe_price_id: lesson.stripe_price_id,
      stripe_account_id: lesson.stripe_account_id
    });
    console.log('Purchase initiated for lesson:', lessonId);
    
    try {
      const stripe = await loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);
      
      if (!stripe) {
        throw new Error('Stripe failed to load');
      }

      // Get user ID from session
      if (!session?.user?.id) {
        throw new Error('User not authenticated');
      }

      // Create checkout session through our API
      const requestBody = {
        lesson_id: lessonId,
        price_amount: lesson.price,
        success_url: `${window.location.origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${window.location.origin}/lessons/${lessonId}`,
        user_id: session.user.id,
        stripe_account_id: lesson.stripe_account_id,
        line_items: {
          price_data: {
            currency: 'usd',
            product_data: {
              name: lesson.title,
              description: lesson.description
            },
            unit_amount: lesson.price * 100 // Convert to cents
          },
          quantity: 1
        },
        metadata: {
          lesson_id: lessonId,
          user_id: session.user.id
        }
      };
      
      console.log('Sending checkout request:', {
        url: `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/stripe/checkout_session`,
        method: 'POST',
        body: requestBody
      });

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/stripe/checkout_session`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Server error details:', errorData);
        const errorMessage = Array.isArray(errorData.detail) 
          ? errorData.detail.map(err => `${err.msg} at ${err.loc.join('.')}`).join(', ')
          : errorData.detail || errorData.message || 'Unknown error occurred';
        throw new Error(`Checkout session creation failed: ${errorMessage}`);
      }

      const responseData = await response.json();
      console.log('Checkout response:', responseData);
      
      if (!responseData.sessionId) {
        console.error('Invalid session ID in response:', responseData);
        throw new Error('No session ID received from server');
      }
      const { sessionId } = responseData;

      // Redirect to Stripe checkout
      const { error } = await stripe.redirectToCheckout({
        sessionId
      });

      if (error) {
        throw error;
      }
    } catch (error) {
      console.error('Error during purchase process:', error);
    }
  }

  const handlePlayClick = (lessonId: string) => {
    console.log('Play lesson:', lessonId)
  }

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
  }

  const handleSort = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortBy(e.target.value)
  }

  if (!session) {
    return null;
  }

  return (
    <Box 
      minH="100vh" 
      bg={bgColor}
      p="4"
    >
      <Tabs onChange={setTabIndex} mb={6}>
        <TabList>
          <Tab>All Lessons</Tab>
          <Tab>My Purchased Lessons</Tab>
        </TabList>

        <TabPanels>
          <TabPanel>
            <Box mb={{ base: 6, md: 8 }}>
        <Flex 
          gap={4} 
          mb={6} 
          direction={{ base: "column", md: "row" }}
        >
          <Input
            placeholder="Search lessons..."
            value={searchQuery}
            onChange={handleSearch}
            bg={inputBgColor}
            maxW={{ base: "100%", md: "400px" }}
          />
          <Flex gap={4} flexWrap={{ base: "wrap", md: "nowrap" }} w="100%">
            <Select
              value={sortBy}
              onChange={handleSort}
              bg={inputBgColor}
              maxW={{ base: "100%", md: "200px" }}
              flex={{ base: "1 1 auto", md: "0 1 auto" }}
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </Select>
            <ButtonGroup 
              size="md" 
              isAttached 
              variant="outline"
              flexShrink={0}
              display={{ base: "none", sm: "flex" }}
            >
              <IconButton
                aria-label="Grid view"
                icon={<BsGrid />}
                onClick={() => setViewMode('grid')}
                bg={viewMode === 'grid' ? selectedButtonBg : undefined}
              />
              <IconButton
                aria-label="List view"
                icon={<BsListUl />}
                onClick={() => setViewMode('list')}
                bg={viewMode === 'list' ? selectedButtonBg : undefined}
              />
            </ButtonGroup>
          </Flex>
        </Flex>

        <SimpleGrid 
          role="list"
          className={viewMode === 'grid' ? 'css-grid-view' : 'css-list-view'}
          columns={{ 
            base: 1, 
            md: viewMode === 'grid' ? 2 : 1,
            lg: viewMode === 'grid' ? 3 : 1
          }}
          spacing={6}
        >
          {filteredLessons.map(lesson => (
            <Box data-testid="lesson-card" key={lesson.id}>
              <LessonCard
                key={lesson.id}
                id={lesson.id}
                title={lesson.title}
                description={lesson.description}
                price={lesson.price}
                stripe_price_id={lesson.stripe_price_id}
                stripe_account_id={lesson.stripe_account_id}
                isNew={Date.now() - new Date(lesson.created_at).getTime() < 604800000}
                isPurchased={purchasedLessons.some(pl => pl.id === lesson.id)}
                purchasedAt={purchasedLessons.find(pl => pl.id === lesson.id)?.created_at}
                onPurchaseClick={() => handlePurchaseClick(lesson.id)}
                onPlayClick={handlePlayClick}
              />
            </Box>
          ))}
        </SimpleGrid>
      </Box>
    </TabPanel>

    <TabPanel>
      <SimpleGrid 
        columns={{ 
          base: 1, 
          md: viewMode === 'grid' ? 2 : 1,
          lg: viewMode === 'grid' ? 3 : 1
        }}
        spacing={6}
      >
        {filteredLessons.map(lesson => (
          <LessonCard
            key={lesson.id}
            id={lesson.id}
            title={lesson.title}
            description={lesson.description}
            isPurchased={true}
            purchasedAt={lesson.purchase_date}
            onPlayClick={() => handlePlayClick(lesson.id)}
          />
        ))}
      </SimpleGrid>
    </TabPanel>
  </TabPanels>
</Tabs>
</Box>
  )
}

export default Lessons
