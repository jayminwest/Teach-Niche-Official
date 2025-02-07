# Vimeo API Endpoints for MVP

## 1. Video Upload & Management

### POST /api/vimeo/upload
- Initiates video upload
- Handles file upload with progress tracking
- Returns video ID and status

### POST /api/vimeo/metadata/{video_id}
- Updates video title, description, privacy settings
- Used after successful upload or for editing existing videos

### DELETE /api/vimeo/videos/{video_id}
- Deletes a video
- Important for content management and cleanup

## 2. Video Playback & Access

### GET /api/vimeo/player/{video_id}
- Gets player configuration and embed details
- Returns necessary tokens/auth for playback
- Includes video metadata

### GET /api/vimeo/status/{video_id}
- Checks video processing status
- Returns current state (processing, ready, error)

### GET /api/vimeo/playback-config/{video_id}
- Gets playback configuration (quality settings, autoplay, controls)
- Returns player customization options
- Important for the learning experience

### POST /api/vimeo/progress/{video_id}
- Tracks viewer progress through video
- Saves timestamps for resume functionality
- Essential for e-learning features

## 3. Analytics & Tracking

### GET /api/vimeo/analytics/{video_id}
- Basic video metrics (views, completion rate)
- Viewer engagement data
- Essential for creator insights

## 4. Webhook Handlers

### POST /api/vimeo/webhooks
- Handles Vimeo event notifications
- Processing completion events
- Error notifications
- Upload status updates

## Implementation Considerations

### Error Handling
- Upload failures
- Processing errors
- Playback issues

### Security
- Video access control
- Private video handling
- Secure token management

### Integration Points
- Connect with lesson creation flow
- Integrate with user permissions
- Link with payment/access control

## 5. Thumbnail Management

### GET /api/vimeo/thumbnails/{video_id}
- Retrieves available thumbnails for a video
- Important for lesson preview/display

### POST /api/vimeo/thumbnails/{video_id}
- Allows setting custom thumbnail
- Essential for lesson presentation

## 6. Video Access Management

### POST /api/vimeo/access/{video_id}
- Updates video access settings
- Controls who can view content
- Essential for paid content protection
- Validates against purchases table
- Checks lesson_status and purchase_status
- Respects profiles.deleted_at for access control

## Database Integration Details

### Lesson Status Management
- Tracks lesson_status enum ('draft', 'published', 'archived')
- Manages purchase_status enum ('pending', 'completed', 'failed', 'refunded')
- Updates lessons.version for change tracking
- Handles soft deletes via deleted_at timestamps

### Database Relationships
- Validates creator_id against profiles.id
- Links lessons to categories through lesson_category junction
- Tracks purchases with user_id, lesson_id, and creator_id
- Manages reviews with rating constraints (1-5)

### Security & Access Control
- Verifies profiles.vimeo_access_token for API access
- Checks profiles.deleted_at for user access
- Validates purchases.status for content access
- Manages stripe_product_id and stripe_price_id synchronization

### Analytics Integration
- Links video metrics to reviews table
- Tracks purchase history and status
- Monitors lesson engagement through purchases
- Handles featured content (lessons.is_featured)

### Content Management
- Updates lessons.thumbnail_url for video previews
- Manages lessons.vimeo_video_id and lessons.vimeo_url
- Tracks content updates via lessons.updated_at
- Handles lesson metadata (title, description, price)
