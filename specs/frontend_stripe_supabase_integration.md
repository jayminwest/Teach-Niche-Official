## High-Level Objective

Create a seamless user experience for purchasing lessons through Stripe checkout integration, while maintaining proper access control and purchase history tracking in Supabase.

# RELEVANT FILES:
frontend/src/components/LessonCard.tsx           
frontend/src/context/AuthContext.tsx 
frontend/src/lib/supabase.ts
frontend/src/lib/stripe.ts
frontend/src/pages/api/stripe/checkout_session.ts
frontend/src/pages/lessons.tsx

## Mid-Level Objectives

1. Frontend Purchase Flow
   - Update LessonCard purchase handling to initiate Stripe checkout
   - Modify lessons page to fetch and display purchase status
   - Add loading states during checkout process
   - Implement purchase success/failure redirects and notifications
   - Display purchase history in user profile

2. Security & Error Handling
   - Validate user authentication for purchases
   - Implement proper error recovery for failed transactions
   - Add comprehensive error logging
   - Ensure proper access control for purchased content

## Implementation Notes

- Add loading states to prevent double purchases
- Use Stripe metadata to link checkout sessions to lessons
- Implement proper error boundaries in React components
- Add comprehensive logging for debugging


To achieve the goals outlined in `specs/frontend_stripe_supabase_integration.md`, we need to update several frontend components and backend routes. Here are the specific edits you need to make:

### Edit `frontend/src/components/LessonCard.tsx`

Add a loading state to prevent double purchases and initiate Stripe checkout on purchase click.

```typescript
// Add these imports at the top of the file
import { useState } from 'react';
import { useRouter } from 'next/router';

// Update the LessonCard component
export const LessonCard = ({
  id,
  title,
  description,
  price,
  isPurchased,
  purchasedAt,
  isNew,
  imageUrl,
  onPurchaseClick,
}: LessonCardProps) => {
  // Add loading state
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handlePurchaseClick = async () => {
    if (loading) return;
    setLoading(true);

    try {
      const response = await fetch(`/api/stripe/checkout_session`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ lessonId: id }),
      });

      const session = await response.json();

      // Redirect to Stripe checkout
      router.push(session.url);
    } catch (error) {
      console.error('Error initiating purchase:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card hoverable>
      <Box p={4}>
        {loading && <Text>Processing...</Text>}
        {!loading && (
          <>
            <Image src={imageUrl} alt={title} />
            <Heading size="md">{title}</Heading>
            <Text>{description}</Text>
            <Text fontSize="sm" color={textColor}>
              Price: ${price}
            </Text>
            {isPurchased && (
              <Text fontSize="sm" color={textColor}>
                Purchased: {new Date(purchasedAt!).toLocaleDateString()}
              </Text>
            )}
          </>
        )}
      </Box>
      {!isPurchased && !loading && (
        <Button onClick={handlePurchaseClick} disabled={loading}>
          Purchase
        </Button>
      )}
    </Card>
  );
};
```

### Edit `frontend/src/pages/lessons.tsx`

Modify the lessons page to fetch and display purchase status.

```typescript
// Add these imports at the top of the file
import { useEffect, useState } from 'react';
import supabase from '../lib/supabase';

// Update the LessonsPage component
const LessonsPage = () => {
  const [lessons, setLessons] = useState([]);
  const [userPurchases, setUserPurchases] = useState({});

  useEffect(() => {
    // Fetch lessons from Supabase
    async function fetchLessons() {
      const { data, error } = await supabase.from('lessons').select('*');
      if (error) console.error(error);
      else setLessons(data);
    }

    fetchLessons();
  }, []);

  useEffect(() => {
    // Fetch user purchases from Supabase
    async function fetchPurchases() {
      const { data, error } = await supabase.from('purchases').select('*');
      if (error) console.error(error);
      else setUserPurchases(data.reduce((acc, purchase) => {
        acc[purchase.lesson_id] = true;
        return acc;
      }, {}));
    }

    fetchPurchases();
  }, []);

  return (
    <div>
      {lessons.map(lesson => (
        <LessonCard
          key={lesson.id}
          id={lesson.id}
          title={lesson.title}
          description={lesson.description}
          price={lesson.price}
          isPurchased={userPurchases[lesson.id]}
          purchasedAt={userPurchases[lesson.id] ? new Date().toISOString() : undefined}
        />
      ))}
    </div>
  );
};

export default LessonsPage;
```

### Edit `frontend/src/pages/api/stripe/checkout_session.ts`

Create a backend API route to handle Stripe checkout sessions.

```typescript
// Add these imports at the top of the file
import { NextApiRequest, NextApiResponse } from 'next';
import stripe from '../../lib/stripe';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { lessonId } = req.body;

    try {
      // Create a Stripe checkout session
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
          {
            price_data: {
              currency: 'usd',
              product_data: {
                name: `Lesson ${lessonId}`,
              },
              unit_amount: 1000, // Amount in cents
            },
            quantity: 1,
          },
        ],
        mode: 'payment',
        success_url: `${req.headers.origin}/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${req.headers.origin}/cancel`,
      });

      res.status(200).json({ url: session.url });
    } catch (error) {
      console.error('Error creating checkout session:', error);
      res.status(500).json({ error: 'Failed to create checkout session' });
    }
  } else {
    res.setHeader('Allow', 'POST');
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
```

### Edit `frontend/src/pages/profile.tsx`

Display purchase history in the user profile.

```typescript
// Add these imports at the top of the file
import { useEffect, useState } from 'react';
import supabase from '../lib/supabase';

const ProfilePage = () => {
  const [purchases, setPurchases] = useState([]);

  useEffect(() => {
    // Fetch user purchases from Supabase
    async function fetchPurchases() {
      const { data, error } = await supabase.from('purchases').select('*');
      if (error) console.error(error);
      else setPurchases(data);
    }

    fetchPurchases();
  }, []);

  return (
    <div>
      <h1>Your Purchases</h1>
      {purchases.map(purchase => (
        <div key={purchase.id}>
          <h2>{purchase.lesson_title}</h2>
          <p>Purchased on: {new Date(purchase.created_at).toLocaleDateString()}</p>
        </div>
      ))}
    </div>
  );
};

export default ProfilePage;
```

### Edit `frontend/src/lib/stripe.ts`

Ensure the Stripe client is properly configured.

```typescript
// Add these imports at the top of the file
import Stripe from 'stripe';

const stripe = new Stripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!, {
  apiVersion: '2022-11-15',
});

export default stripe;
```

### Edit `frontend/src/lib/supabase.ts`

Ensure the Supabase client is properly configured.

```typescript
// Add these imports at the top of the file
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
```

These edits should help you achieve the goals outlined in `specs/frontend_stripe_supabase_integration.md`.
