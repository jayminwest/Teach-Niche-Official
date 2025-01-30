import { NextPage } from 'next'
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
  isNew?: boolean;
  purchased_at?: string;
}

const SAMPLE_LESSONS: Lesson[] = [
  {
    id: "1",
    title: "Getting Started with Web Development",
    description: "Learn the fundamentals of web development including HTML, CSS, and JavaScript. Perfect for beginners looking to start their coding journey.",
    price: 29.99,
    isNew: true
  },
  {
    id: "2",
    title: "Advanced React Patterns",
    description: "Master advanced React concepts including hooks, context, and performance optimization techniques for building scalable applications.",
    price: 49.99
  },
  {
    id: "3",
    title: "Full Stack Development with Next.js",
    description: "Build modern full-stack applications using Next.js, incorporating API routes, authentication, and database integration.",
    price: 59.99,
    isNew: true
  },
  {
    id: "4",
    title: "TypeScript Mastery",
    description: "Deep dive into TypeScript features, advanced types, and best practices for building type-safe applications.",
    price: 39.99
  }
];

const Lessons: NextPage = () => {
  const { session } = useAuth()
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState('newest')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [purchasedLessons, setPurchasedLessons] = useState<Lesson[]>([])
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

    fetchPurchasedLessons();
  }, [session]);

  const filteredLessons = useMemo(() => {
    let results = tabIndex === 0 ? [...SAMPLE_LESSONS] : [...purchasedLessons];
    
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
          return a.id.localeCompare(b.id);
        case 'newest':
        default:
          return b.id.localeCompare(a.id);
      }
    });
    
    return results;
  }, [searchQuery, sortBy]);


  const handlePurchaseClick = async (lessonId: string, price: number) => {
    console.log('Purchase initiated for lesson:', lessonId);
    
    try {
      // Call backend directly instead of going through Next.js API route
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/stripe/checkout_session`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          line_items: [{
            price_data: {
              currency: 'usd',
              product_data: {
                name: `Lesson ${lessonId}`,
              },
              unit_amount: Math.round(price * 100), // Convert to cents for Stripe
            },
            quantity: 1,
          }],
          mode: 'payment',
          success_url: `${window.location.origin}/lessons?success=true`,
          cancel_url: `${window.location.origin}/lessons?canceled=true`,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create checkout session');
      }

      const data = await response.json();
      console.log('Stripe checkout session created successfully:', data);
      
      // Redirect to Stripe Checkout
      window.location.href = data.url;
      
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
              price={lesson.price}
              isNew={lesson.isNew}
              isPurchased={purchasedLessons.some(pl => pl.id === lesson.id)}
              purchasedAt={purchasedLessons.find(pl => pl.id === lesson.id)?.purchase_date}
              onPurchaseClick={() => handlePurchaseClick(lesson.id, lesson.price)}
              onPlayClick={handlePlayClick}
            />
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
