# Supabase API Endpoints

## Lessons

### Database Schema
```sql
create table lessons (
  id uuid default uuid_generate_v4() primary key,
  title text not null,
  description text not null,
  price decimal not null,
  is_new boolean default true,
  image_url text,
  creator_id uuid references auth.users not null,
  created_at timestamp with time zone default timezone('utc'::text, now()),
  status text check (status in ('draft', 'published')) default 'draft',
  video_id text
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
create table purchases (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users not null,
  lesson_id uuid references lessons not null,
  purchased_at timestamp with time zone default timezone('utc'::text, now()),
  stripe_payment_intent_id text not null,
  status text check (status in ('completed', 'refunded')) default 'completed'
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
create table profiles (
  id uuid references auth.users primary key,
  full_name text,
  email text not null,
  avatar_url text,
  bio text,
  social_media_tag text,
  stripe_account_id text,
  stripe_onboarding_complete boolean default false
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
