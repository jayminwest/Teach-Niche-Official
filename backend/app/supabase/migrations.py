from typing import Dict, Any
from .client import get_supabase_client

INITIAL_SCHEMA = """
-- Enum Types
CREATE TYPE purchase_status AS ENUM ('pending', 'completed', 'failed', 'refunded');
CREATE TYPE lesson_status AS ENUM ('draft', 'published', 'archived');

-- Categories Table
CREATE TABLE categories (
    id uuid PRIMARY KEY,
    name text NOT NULL UNIQUE,
    created_at timestamp with time zone NOT NULL DEFAULT NOW(),
    updated_at timestamp with time zone NOT NULL DEFAULT NOW()
);

-- Profiles Table
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

-- Lessons Table
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

-- Purchases Table
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

-- Reviews Table
CREATE TABLE reviews (
    id uuid PRIMARY KEY,
    user_id uuid NOT NULL REFERENCES profiles(id),
    lesson_id uuid NOT NULL REFERENCES lessons(id),
    rating integer NOT NULL CHECK (rating BETWEEN 1 AND 5),
    comment text,
    created_at timestamp with time zone NOT NULL DEFAULT NOW(),
    updated_at timestamp with time zone NOT NULL DEFAULT NOW()
);

-- Lesson Categories Junction Table
CREATE TABLE lesson_category (
    lesson_id uuid NOT NULL REFERENCES lessons(id),
    category_id uuid NOT NULL REFERENCES categories(id),
    PRIMARY KEY (lesson_id, category_id)
);

-- Indexes
CREATE INDEX idx_profiles_email ON profiles(email);
CREATE INDEX idx_purchases_user_id ON purchases(user_id);
CREATE INDEX idx_purchases_creator_id ON purchases(creator_id);
CREATE INDEX idx_lessons_creator_id ON lessons(creator_id);
CREATE UNIQUE INDEX idx_lesson_category_unique ON lesson_category(lesson_id, category_id);
"""

def apply_migration(section: str, migration_data: Dict[str, Any] = None) -> Dict[str, Any]:
    """
    Applies migrations to a specified section of the database.

    Args:
        section (str): The section of the database to migrate
        migration_data (Dict[str, Any], optional): Migration data including SQL commands. 
            If None, applies initial schema.

    Returns:
        Dict[str, Any]: Migration results

    Raises:
        Exception: If migration fails
    """
    supabase = get_supabase_client()
    
    try:
        # If no migration data provided, use initial schema
        sql = migration_data.get('sql') if migration_data else INITIAL_SCHEMA
        
        # Execute raw SQL for migrations
        response = supabase.raw_query(sql).execute()
        
        if hasattr(response, 'error') and response.error:
            raise Exception(f"Migration failed: {response.error}")
            
        return {
            'status': 'success',
            'data': response.get('data', {})
        }
    except Exception as e:
        return {
            'status': 'error',
            'message': str(e)
        }

if __name__ == '__main__':
    print("Applying initial schema migration...")
    result = apply_migration('initial')
    print(f"Migration result: {result}")
