| table_name               | column_name                | data_type                | is_nullable | constraints                          |
|--------------------------|----------------------------|--------------------------|-------------|--------------------------------------|
| categories               | id                         | uuid                     | NO          | PRIMARY KEY                          |
| categories               | name                       | text                     | NO          | UNIQUE                               |
| categories               | created_at                 | timestamp with time zone | NO          | DEFAULT NOW()                        |
| categories               | updated_at                 | timestamp with time zone | NO          | DEFAULT NOW()                        |
| profiles                 | id                         | uuid                     | NO          | PRIMARY KEY                          |
| profiles                 | full_name                  | text                     | NO          |                                      |
| profiles                 | email                      | text                     | NO          | UNIQUE                               |
| profiles                 | bio                        | text                     | YES         |                                      |
| profiles                 | avatar_url                 | text                     | YES         |                                      |
| profiles                 | social_media_tag           | text                     | YES         |                                      |
| profiles                 | created_at                 | timestamp with time zone | NO          | DEFAULT NOW()                        |
| profiles                 | updated_at                 | timestamp with time zone | NO          | DEFAULT NOW()                        |
| profiles                 | stripe_account_id          | text                     | YES         | ENCRYPTED                            |
| profiles                 | stripe_onboarding_complete | boolean                  | NO          | DEFAULT FALSE                        |
| profiles                 | vimeo_access_token         | text                     | YES         | ENCRYPTED                            |
| profiles                 | deleted_at                 | timestamp with time zone | YES         |                                      |
| purchases                | id                         | uuid                     | NO          | PRIMARY KEY                          |
| purchases                | user_id                    | uuid                     | NO          | FOREIGN KEY REFERENCES profiles(id)  |
| purchases                | lesson_id                  | uuid                     | NO          | FOREIGN KEY REFERENCES lessons(id)   |
| purchases                | creator_id                 | uuid                     | NO          | FOREIGN KEY REFERENCES profiles(id)  |
| purchases                | purchase_date              | timestamp with time zone | NO          | DEFAULT NOW()                        |
| purchases                | stripe_session_id          | text                     | NO          | UNIQUE, ENCRYPTED                    |
| purchases                | amount                     | numeric(19,4)            | NO          | CHECK (amount >= 0)                  |
| purchases                | platform_fee               | numeric(19,4)            | NO          | CHECK (platform_fee >= 0)            |
| purchases                | creator_earnings           | numeric(19,4)            | NO          | CHECK (creator_earnings >= 0)        |
| purchases                | payment_intent_id          | text                     | NO          | ENCRYPTED                            |
| purchases                | fee_percentage             | numeric(5,2)             | NO          | CHECK (fee_percentage BETWEEN 0 AND 100) |
| purchases                | status                     | purchase_status          | NO          | DEFAULT 'pending'                    |
| purchases                | metadata                   | jsonb                    | YES         |                                      |
| purchases                | created_at                 | timestamp with time zone | NO          | DEFAULT NOW()                        |
| purchases                | updated_at                 | timestamp with time zone | NO          | DEFAULT NOW()                        |
| purchases                | version                    | integer                  | NO          | DEFAULT 1                            |
| reviews                  | id                         | uuid                     | NO          | PRIMARY KEY                          |
| reviews                  | user_id                    | uuid                     | NO          | FOREIGN KEY REFERENCES profiles(id)  |
| reviews                  | lesson_id                  | uuid                     | NO          | FOREIGN KEY REFERENCES lessons(id)   |
| reviews                  | rating                     | integer                  | NO          | CHECK (rating BETWEEN 1 AND 5)       |
| reviews                  | comment                    | text                     | YES         |                                      |
| reviews                  | created_at                 | timestamp with time zone | NO          | DEFAULT NOW()                        |
| reviews                  | updated_at                 | timestamp with time zone | NO          | DEFAULT NOW()                        |
| lesson_category          | lesson_id                  | uuid                     | NO          | PRIMARY KEY, FOREIGN KEY REFERENCES lessons(id) |
| lesson_category          | category_id                | uuid                     | NO          | PRIMARY KEY, FOREIGN KEY REFERENCES categories(id) |
| lessons                  | id                         | uuid                     | NO          | PRIMARY KEY                          |
| lessons                  | title                      | text                     | NO          |                                      |
| lessons                  | description                | text                     | YES         |                                      |
| lessons                  | price                      | numeric(19,4)            | NO          | CHECK (price >= 0)                   |
| lessons                  | vimeo_video_id             | text                     | YES         |                                      |
| lessons                  | creator_id                 | uuid                     | NO          | FOREIGN KEY REFERENCES profiles(id)  |
| lessons                  | created_at                 | timestamp with time zone | NO          | DEFAULT NOW()                        |
| lessons                  | updated_at                 | timestamp with time zone | NO          | DEFAULT NOW()                        |
| lessons                  | stripe_product_id          | text                     | YES         |                                      |
| lessons                  | stripe_price_id            | text                     | YES         |                                      |
| lessons                  | content                    | text                     | YES         |                                      |
| lessons                  | content_url                | text                     | YES         |                                      |
| lessons                  | thumbnail_url              | text                     | YES         |                                      |
| lessons                  | vimeo_url                  | text                     | YES         |                                      |
| lessons                  | is_featured                | boolean                  | NO          | DEFAULT FALSE                        |
| lessons                  | status                     | lesson_status            | NO          | DEFAULT 'draft'                      |
| lessons                  | deleted_at                 | timestamp with time zone | YES         |                                      |
| lessons                  | version                    | integer                  | NO          | DEFAULT 1                            |

-- Enum Types
CREATE TYPE purchase_status AS ENUM ('pending', 'completed', 'failed', 'refunded');
CREATE TYPE lesson_status AS ENUM ('draft', 'published', 'archived');

-- Indexes
CREATE INDEX idx_profiles_email ON profiles(email);
CREATE INDEX idx_purchases_user_id ON purchases(user_id);
CREATE INDEX idx_purchases_creator_id ON purchases(creator_id);
CREATE INDEX idx_lessons_creator_id ON lessons(creator_id);
CREATE UNIQUE INDEX idx_lesson_category_unique ON lesson_category(lesson_id, category_id);
