| table_name               | column_name                | data_type                | is_nullable |
| ------------------------ | -------------------------- | ------------------------ | ----------- |
| categories               | id                         | bigint                   | NO          |
| categories               | created_at                 | timestamp with time zone | NO          |
| profiles                 | id                         | uuid                     | NO          |
| profiles                 | full_name                  | text                     | YES         |
| profiles                 | email                      | text                     | YES         |
| profiles                 | bio                        | text                     | YES         |
| profiles                 | avatar_url                 | text                     | YES         |
| profiles                 | social_media_tag           | text                     | YES         |
| profiles                 | created_at                 | timestamp with time zone | YES         |
| profiles                 | updated_at                 | timestamp with time zone | YES         |
| profiles                 | stripe_account_id          | text                     | YES         |
| profiles                 | stripe_onboarding_complete | boolean                  | YES         |
| profiles                 | vimeo_access_token         | text                     | YES         |
| purchases                | id                         | uuid                     | NO          |
| purchases                | user_id                    | uuid                     | YES         |
| purchases                | lesson_id                  | uuid                     | YES         |
| purchases                | purchase_date              | timestamp with time zone | YES         |
| purchases                | stripe_session_id          | text                     | YES         |
| purchases                | creator_id                 | uuid                     | YES         |
| purchases                | amount                     | numeric                  | YES         |
| purchases                | platform_fee               | numeric                  | YES         |
| purchases                | creator_earnings           | numeric                  | YES         |
| purchases                | payment_intent_id          | text                     | YES         |
| purchases                | fee_percentage             | integer                  | YES         |
| purchases                | status                     | text                     | YES         |
| purchases                | metadata                   | jsonb                    | YES         |
| purchases                | created_at                 | timestamp with time zone | YES         |
| purchases                | updated_at                 | timestamp with time zone | YES         |
| reviews                  | id                         | integer                  | NO          |
| reviews                  | user_id                    | uuid                     | YES         |
| reviews                  | lesson_id                  | uuid                     | YES         |
| reviews                  | rating                     | integer                  | YES         |
| reviews                  | comment                    | text                     | YES         |
| reviews                  | created_at                 | timestamp with time zone | YES         |
| lesson_categories        | id                         | integer                  | NO          |
| lesson_categories        | name                       | text                     | NO          |
| lesson_categories        | lesson_id                  | uuid                     | YES         |
| lesson_categories        | category_id                | text                     | YES         |
| lessons                  | id                         | uuid                     | NO          |
| lessons                  | title                      | text                     | NO          |
| lessons                  | description                | text                     | YES         |
| lessons                  | price                      | numeric                  | YES         |
| lessons                  | vimeo_video_id             | text                     | YES         |
| lessons                  | creator_id                 | uuid                     | NO          |
| lessons                  | created_at                 | timestamp with time zone | YES         |
| lessons                  | updated_at                 | timestamp with time zone | YES         |
| lessons                  | stripe_product_id          | text                     | YES         |
| lessons                  | stripe_price_id            | text                     | YES         |
| lessons                  | content                    | text                     | YES         |
| lessons                  | content_url                | text                     | YES         |
| lessons                  | thumbnail_url              | text                     | YES         |
| lessons                  | vimeo_url                  | text                     | YES         |
| lessons                  | is_featured                | boolean                  | YES         |
| lessons                  | status                     | text                     | YES         
