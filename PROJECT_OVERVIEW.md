# Project Overview

## High Level Overview
This is a full-stack web application with a Next.js frontend and FastAPI backend, integrating with Stripe for payments and Supabase for authentication and database functionality. The project has a strong focus on e-learning capabilities, with features like lessons, purchases, and user profiles.

Key components:
1. Frontend: Next.js with TypeScript, Chakra UI, and Tailwind CSS
2. Backend: FastAPI with Stripe integration
3. Infrastructure: Dockerized with production-ready configurations
4. Authentication: Supabase-based auth system
5. Payments: Comprehensive Stripe integration

## Mid Level Breakdown

### Backend Architecture
The backend serves as:
1. API Gateway: Handles all frontend requests
2. Payment Processor: Manages Stripe integration including:
   - Checkout sessions
   - Webhooks
   - Payouts
   - Compliance
   - Onboarding
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
1. User Interface: Built with Chakra UI components
2. Authentication Flow: Login, signup, password reset
3. Lesson Management: Viewing and purchasing lessons
4. Profile Management: User profile and purchased content
5. Theme System: Customizable UI theme

Key dependencies:
- Next.js (React framework)
- Chakra UI (component library)
- Tailwind CSS (utility-first CSS)
- Supabase (client-side auth)
- TypeScript (type safety)

### Interaction Flow
1. Authentication:
   - Frontend → Supabase API → Backend
2. Payments:
   - Frontend → Backend → Stripe API
3. Content Delivery:
   - Frontend → Backend → Supabase Database
4. Webhooks:
   - Stripe → Backend → Database updates

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
