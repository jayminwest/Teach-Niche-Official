# Project Overview

## High Level Overview
This is a marketplace application with a Next.js frontend and FastAPI backend, using Stripe Connect for payment processing, Vimeo for video storage, and Supabase for authentication and database functionality. The project enables creators to sell lessons, with marketplace features including:

1. Creator onboarding via Stripe Connect
2. Payout management for creators
3. Marketplace fee structure
4. E-learning capabilities with features including:
   - Lesson creation and management
   - Video upload and processing
   - Lesson metadata (title, description, price)
   - Purchases and access control
   - User profiles and progress tracking

Key components:
1. Frontend: Next.js with TypeScript and Tailwind CSS
2. Backend: FastAPI with Stripe and Vimeo integration
3. Infrastructure: Dockerized with production-ready configurations
4. Authentication: Supabase-based auth system
5. Payments: Comprehensive Stripe integration
6. Video Storage: Vimeo for secure video hosting and delivery

## Mid Level Breakdown

### Backend Architecture
The backend serves as:
1. API Gateway: Handles all frontend requests
2. Payment Processor: Manages Stripe Connect integration including:
   - Marketplace account creation
   - Connected account onboarding
   - Split payments
   - Payout scheduling
   - Webhooks
   - Compliance
   - Marketplace fee management
3. Authentication Proxy: Interfaces with Supabase for:
   - Email/password auth
   - Google auth
   - Password resets
4. Configuration Management: Uses Pydantic models for settings

Key dependencies:
- FastAPI (web framework)
- Stripe (payment processing)
- Supabase (auth/database)
- Pydantic (data validation)
- Uvicorn (ASGI server)

### Frontend Architecture
The frontend provides:
1. User Interface: Built with custom components and Tailwind CSS
2. Authentication Flow: Login, signup, password reset
3. Lesson Management:
   - Lesson creation interface
   - Video upload to Vimeo
   - Metadata editing
   - Pricing configuration
   - Viewing and purchasing lessons
   - Vimeo video integration
4. Profile Management: User profile and purchased content
5. Theme System: Customizable UI theme

Key dependencies:
- Next.js (React framework)
- Tailwind CSS (utility-first CSS)
- Supabase (client-side auth)
- TypeScript (type safety)
- Vimeo Player (video playback)

### Interaction Flow
1. Authentication:
   - Frontend → Supabase API → Backend
2. Payments:
   - Frontend → Backend → Stripe Connect API
   - Marketplace fee calculations
   - Split payments between platform and creators
3. Content Creation & Delivery:
   - Lesson creation UI → Backend → Vimeo/Supabase
   - Video processing pipeline
   - Metadata storage in Supabase
   - Content delivery to learners
4. Video Delivery:
   - Frontend → Vimeo API → Backend
5. Webhooks:
   - Stripe → Backend → Database updates
   - Vimeo → Backend → Database updates

## Low Level Details

### Backend Implementation
1. Stripe Integration:
   - Webhook handling with signature verification
   - Payment intent management
   - Payout scheduling
   - Onboarding flows for new accounts
   - Dashboard session management

2. Supabase Integration:
   - Client initialization with caching
   - Auth methods for email/password and Google
   - Edge function support
   - Database migrations

3. API Structure:
   - Modular FastAPI routers
   - Base route handler
   - Type-safe configuration
   - Comprehensive testing setup

### Frontend Implementation
1. Component Library:
   - Reusable UI components (Button, Card, Section)
   - Layout system with header/hero customization
   - Auth-specific components (forms, context)
   - Lesson creation form components
   - Video upload interface
   - Vimeo video player integration

2. State Management:
   - Auth context for user state
   - Type-safe props and interfaces
   - Environment variable handling

3. Testing:
   - Jest test setup
   - Component tests
   - Page-level tests

### Infrastructure
1. Docker:
   - Separate dev/prod configurations
   - Frontend/backend containers
   - Environment variable management

2. CI/CD:
   - Pytest configuration
   - Coverage reporting
   - Linting setup

This architecture provides a robust foundation for an e-learning platform with secure payments, user authentication, and content management capabilities. The separation of concerns between frontend and backend, along with the use of modern frameworks and services, makes this a scalable and maintainable solution.
