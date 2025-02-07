# Supabase API Endpoints

## Lessons

### Database Schema
```sql
CREATE TABLE lessons (
    id uuid PRIMARY KEY,
    title text NOT NULL,
    description text,
    price numeric(19,4) NOT NULL CHECK (price >= 0),
    vimeo_video_id text,
    creator_id uuid NOT NULL REFERENCES profiles(id),
    created_at timestamp with time zone NOT NULL DEFAULT NOW(),
    updated_at timestamp with time zone NOT NULL DEFAULT NOW(),
    stripe_product_id text,
    stripe_price_id text,
    content text,
    content_url text,
    thumbnail_url text,
    vimeo_url text,
    is_featured boolean NOT NULL DEFAULT FALSE,
    status lesson_status NOT NULL DEFAULT 'draft',
    deleted_at timestamp with time zone,
    version integer NOT NULL DEFAULT 1
);

-- Categories
CREATE TABLE categories (
    id uuid PRIMARY KEY,
    name text NOT NULL UNIQUE,
    created_at timestamp with time zone NOT NULL DEFAULT NOW(),
    updated_at timestamp with time zone NOT NULL DEFAULT NOW()
);

-- Lesson Categories Junction
CREATE TABLE lesson_category (
    lesson_id uuid NOT NULL REFERENCES lessons(id),
    category_id uuid NOT NULL REFERENCES categories(id),
    PRIMARY KEY (lesson_id, category_id)
);
```

### Endpoints
```typescript
// GET /api/lessons
interface ListLessonsParams {
  search?: string;  // Filter title/description
  sort?: 'newest' | 'oldest' | 'price-low' | 'price-high';
  limit?: number;
  offset?: number;
  category?: string; // Filter by category
}

// GET /api/lessons/featured
// Returns published & featured lessons

// GET /api/lessons/created
// Returns current user's created lessons

// POST /api/lessons
interface CreateLessonParams {
  title: string;
  description?: string;
  price: number;
  content?: string;
  content_url?: string;
  categories?: string[]; // category ids
}

// PATCH /api/lessons/{id}
interface UpdateLessonParams {
  title?: string;
  description?: string;
  price?: number;
  content?: string;
  content_url?: string;
  status?: 'draft' | 'published' | 'archived';
  is_featured?: boolean;
  categories?: string[];
}

// DELETE /api/lessons/{id}
// Soft deletes lesson

// GET /api/lessons/{id}
interface Lesson {
  id: string;
  title: string;
  description: string;
  price: number;
  creator_id: string;
  created_at: string;
  updated_at: string;
  stripe_product_id?: string;
  stripe_price_id?: string;
  content?: string;
  content_url?: string;
  thumbnail_url?: string;
  vimeo_video_id?: string;
  vimeo_url?: string;
  is_featured: boolean;
  status: 'draft' | 'published' | 'archived';
  deleted_at?: string;
  version: number;
  categories?: Category[];
}

// GET /api/categories
interface Category {
  id: string;
  name: string;
  created_at: string;
  updated_at: string;
}

// GET /api/categories/{category_id}/lessons
// Returns lessons in a category

// POST /api/categories (admin only)
interface CreateCategoryParams {
  name: string;
}

// PATCH /api/categories/{id} (admin only)
interface UpdateCategoryParams {
  name: string;
}

// POST /api/lessons/{lesson_id}/categories
interface AddLessonCategoryParams {
  category_id: string;
}

// DELETE /api/lessons/{lesson_id}/categories/{category_id}
// Removes category from lesson

// GET /api/reviews/lesson/{lesson_id}
interface Review {
  id: string;
  user_id: string;
  lesson_id: string;
  rating: number; // 1-5
  comment?: string;
  created_at: string;
  updated_at: string;
}

// POST /api/reviews
interface CreateReviewParams {
  lesson_id: string;
  rating: number;
  comment?: string;
}

// PATCH /api/reviews/{id}
interface UpdateReviewParams {
  rating?: number;
  comment?: string;
}

// DELETE /api/reviews/{id}
// Deletes review if owned by user

// GET /api/profiles/{user_id}/reviews
// Get all reviews by user

// GET /api/profiles/{user_id}/earnings
interface CreatorEarnings {
  total_earnings: number;
  pending_earnings: number;
  paid_earnings: number;
  recent_purchases: Purchase[];
  earnings_by_period: {
    period: string;
    amount: number;
  }[];
}
```

## Purchases

### Database Schema
```sql
CREATE TABLE purchases (
    id uuid PRIMARY KEY,
    user_id uuid NOT NULL REFERENCES profiles(id),
    lesson_id uuid NOT NULL REFERENCES lessons(id),
    creator_id uuid NOT NULL REFERENCES profiles(id),
    purchase_date timestamp with time zone NOT NULL DEFAULT NOW(),
    stripe_session_id text NOT NULL UNIQUE,
    amount numeric(19,4) NOT NULL CHECK (amount >= 0),
    platform_fee numeric(19,4) NOT NULL CHECK (platform_fee >= 0),
    creator_earnings numeric(19,4) NOT NULL CHECK (creator_earnings >= 0),
    payment_intent_id text NOT NULL,
    fee_percentage numeric(5,2) NOT NULL CHECK (fee_percentage BETWEEN 0 AND 100),
    status purchase_status NOT NULL DEFAULT 'pending',
    metadata jsonb,
    created_at timestamp with time zone NOT NULL DEFAULT NOW(),
    updated_at timestamp with time zone NOT NULL DEFAULT NOW(),
    version integer NOT NULL DEFAULT 1
);
```

### Endpoints
```typescript
// GET /api/purchases
interface Purchase {
  id: string;
  user_id: string;
  lesson_id: string;
  creator_id: string;
  purchase_date: string;
  stripe_session_id: string;
  amount: number;
  platform_fee: number;
  creator_earnings: number;
  payment_intent_id: string;
  fee_percentage: number;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  metadata?: any;
  created_at: string;
  updated_at: string;
  version: number;
}

// POST /api/purchases/verify/{lesson_id}
// Returns: { hasAccess: boolean }
```

## Profiles

### Database Schema
```sql
CREATE TABLE profiles (
    id uuid PRIMARY KEY,
    full_name text NOT NULL,
    email text NOT NULL UNIQUE,
    bio text,
    avatar_url text,
    social_media_tag text,
    created_at timestamp with time zone NOT NULL DEFAULT NOW(),
    updated_at timestamp with time zone NOT NULL DEFAULT NOW(),
    stripe_account_id text,
    stripe_onboarding_complete boolean NOT NULL DEFAULT FALSE,
    vimeo_access_token text,
    deleted_at timestamp with time zone
);
```

### Endpoints
```typescript
// GET/PATCH /api/profiles/{user_id}
interface Profile {
  id: string;
  full_name: string;
  email: string;
  avatar_url?: string;
  bio?: string;
  social_media_tag?: string;
  stripe_account_id?: string;
  stripe_onboarding_complete: boolean;
  vimeo_access_token?: string;
  deleted_at?: string;
  created_at: string;
  updated_at: string;
}
```

## Row Level Security (RLS) Policies

### Lessons
```sql
-- Enable RLS
alter table lessons enable row level security;

-- Anyone can read published lessons
create policy "Lessons are viewable by everyone" on lessons
  for select using (status = 'published');

-- Creators can manage their own lessons
create policy "Users can manage their own lessons" on lessons
  for all using (creator_id = auth.uid());
```

### Purchases
```sql
-- Enable RLS
alter table purchases enable row level security;

-- Users can only view their own purchases
create policy "Users can view own purchases" on purchases
  for select using (user_id = auth.uid());

-- Only server can insert purchases (after Stripe confirmation)
create policy "Server can insert purchases" on purchases
  for insert with check (false); -- Handled via server API only
```

### Reviews
```sql
-- Enable RLS
alter table reviews enable row level security;

-- Anyone can read reviews for published lessons
create policy "Reviews are viewable by everyone" on reviews
  for select using (
    exists (
      select 1 from lessons 
      where lessons.id = reviews.lesson_id 
      and lessons.status = 'published'
    )
  );

-- Users can create/update their own reviews
create policy "Users can manage their own reviews" on reviews
  for all using (user_id = auth.uid());
```

### Categories
```sql
-- Enable RLS
alter table categories enable row level security;

-- Anyone can read categories
create policy "Categories are viewable by everyone" on categories
  for select using (true);

-- Only admins can manage categories (needs admin role implementation)
```

### Profiles
```sql
-- Enable RLS
alter table profiles enable row level security;

-- Anyone can view profiles
create policy "Profiles are viewable by everyone" on profiles
  for select using (true);

-- Users can update their own profile
create policy "Users can update own profile" on profiles
  for update using (id = auth.uid());
```
