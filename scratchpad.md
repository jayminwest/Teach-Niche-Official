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
}

// GET /api/lessons/featured
// Returns published & featured lessons

// GET /api/lessons/created
// Returns current user's created lessons

// GET /api/lessons/{id}
interface Lesson {
  id: string;
  title: string;
  description: string;
  price: number;
  isNew?: boolean;
  imageUrl?: string;
  creator_id: string;
  created_at: string;
  status: 'draft' | 'published';
  video_id?: string;
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
  purchased_at: string;
  stripe_payment_intent_id: string;
  status: 'completed' | 'refunded';
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
