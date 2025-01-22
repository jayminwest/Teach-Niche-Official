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
| purchases                | tutorial_id                | uuid                     | YES         |
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
| reviews                  | tutorial_id                | uuid                     | YES         |
| reviews                  | rating                     | integer                  | YES         |
| reviews                  | comment                    | text                     | YES         |
| reviews                  | created_at                 | timestamp with time zone | YES         |
| tutorial_categories      | id                         | integer                  | NO          |
| tutorial_categories      | name                       | text                     | NO          |
| tutorial_categories      | tutorial_id                | text                     | YES         |
| tutorial_categories      | category_id                | text                     | YES         |
| tutorials                | id                         | uuid                     | NO          |
| tutorials                | title                      | text                     | NO          |
| tutorials                | description                | text                     | YES         |
| tutorials                | price                      | numeric                  | YES         |
| tutorials                | vimeo_video_id             | text                     | YES         |
| tutorials                | creator_id                 | uuid                     | NO          |
| tutorials                | created_at                 | timestamp with time zone | YES         |
| tutorials                | updated_at                 | timestamp with time zone | YES         |
| tutorials                | stripe_product_id          | text                     | YES         |
| tutorials                | stripe_price_id            | text                     | YES         |
| tutorials                | content                    | text                     | YES         |
| tutorials                | content_url                | text                     | YES         |
| tutorials                | thumbnail_url              | text                     | YES         |
| tutorials                | vimeo_url                  | text                     | YES         |
| tutorials                | is_featured                | boolean                  | YES         |
| tutorials                | status                     | text                     | YES         