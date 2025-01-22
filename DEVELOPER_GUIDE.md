**LLM Developer Guide**

## Table of Contents
1. [Base Prompt & Preferences](#base-prompt--preferences)  
2. [Coding Style Guide](#coding-style-guide)  
3. [Project Goals](#project-goals)  
4. [Testing Guidelines](#testing-guidelines)

---

## Base Prompt & Preferences

### Code Preferences
- **Frontend**: Next.js with TypeScript and Tailwind CSS
- **Backend**: Python 3.10+ with FastAPI
- **Package Manager**: UV for Python, npm for frontend
- **Testing**: pytest for backend, Jest for frontend
- **Documentation**: Google-style docstrings for backend, JSDoc for frontend
- **Key Integrations**:
  - Stripe Connect for payments and payouts
  - Vimeo for video hosting and delivery
  - Supabase for authentication and database

### Workflow
- **CI/CD**: 
  - Automated testing for critical paths (payments, auth, video processing)
  - Automated deployment pipelines via Vercel
- **Security Practices**:
  - Regular security audits of payment and auth flows
  - Dependency vulnerability scanning
  - Secret management for API keys

## Infrastructure & Architecture

### Containerization & Deployment
- **Docker Setup**:
  - Frontend/backend containers
  - Environment variable management
- **Vercel Integration**:
  - Edge Functions for serverless API endpoints
  - Production deployments from main branch
- **CI/CD Pipeline**:
  - Automated test execution
  - Coverage reporting
  - Deployment automation

### State Management Patterns
- **Frontend State**:
  - Auth context for user state
  - Type-safe props and interfaces
  - Environment variable handling
- **Component Library**:
  - Reusable UI components (Button, Card, Section)
  - Auth-specific components (forms, context)
  - Lesson creation form components
  - Video upload interface
  - Vimeo video player integration

## Implementation Patterns

### Integration Patterns

#### Stripe Connect Implementation
- **Account Management**:
  - Implement marketplace account creation flows
  - Handle connected account onboarding
  - Manage account status updates
  - Implement compliance requirements
- **Payment Processing**:
  - Calculate split payments between platform and creators
  - Handle payment disputes and refunds
  - Implement payout scheduling
  - Manage marketplace fees
- **Webhooks**:
  - Handle account.updated events
  - Process payment_intent.succeeded
  - Manage payout.paid events
  - Handle charge.dispute.created

#### Vimeo Integration
- **Video Upload**:
  - Implement resumable uploads
  - Handle upload progress tracking
  - Manage video metadata updates
  - Handle upload completion events
- **Player Integration**:
  - Configure player options (autoplay, controls, quality)
  - Implement event handling (play, pause, ended)
  - Track video analytics
  - Handle error states
- **Content Management**:
  - Sync video metadata with Supabase
  - Handle video privacy settings
  - Manage video thumbnails
  - Implement video deletion flows

### Backend Implementation Details
- **Stripe Integration**:
  - Webhook handling must include signature verification
  - Use idempotency keys for payment operations
  - Implement proper error handling for payment intents
  - Follow Stripe's best practices for payout scheduling
  - Document all webhook endpoints and their handlers
- **Supabase Integration**:
  - Initialize client with proper caching configuration
  - Implement both email/password and Google auth methods
  - Use edge functions for auth-related operations
  - Follow Supabase's migration patterns for database changes
- **API Structure**:
  - Organize FastAPI routers by domain
  - Implement base route handlers for common patterns
  - Use type-safe configuration management
  - Document all API endpoints with OpenAPI annotations

### Frontend Implementation Details

#### Authentication Flow
- Implement login/signup forms
- Handle password reset flows
- Manage session persistence
- Implement protected routes
- Handle auth state changes

#### Lesson Management
- Build lesson creation wizard
- Implement video upload interface
- Create metadata editing forms
- Build pricing configuration UI
- Implement lesson preview functionality

#### Theme System
- Implement theme configuration
- Handle dark/light mode
- Manage custom color schemes
- Implement theme persistence
- Handle theme switching

#### Vimeo Player Integration
- Configure player options
- Handle player events
- Implement progress tracking
- Manage playback controls
- Handle error states
- **Component Library**:
  - Create reusable UI components following atomic design principles
  - Implement a consistent layout system with header/hero components
  - Build auth-specific components with proper error handling
  - Develop lesson creation forms with validation
  - Implement video upload interface with progress tracking
  - Integrate Vimeo player with proper event handling
- **State Management**:
  - Use context API for auth state management
  - Implement type-safe props and interfaces
  - Handle environment variables securely
  - Use proper error boundaries for critical components

## Coding Style Guide

### Frontend (Next.js/TypeScript)
- **Formatting**: 
  - 2 spaces for indentation
  - Single quotes for strings
  - Use Prettier with project-specific config
- **Naming**:
  - Variables/Functions: `camelCase`
  - Components: `PascalCase`
  - Constants: `UPPER_SNAKE_CASE`
  - Interfaces/Types: `PascalCase` with `I` prefix (e.g., `IUserProfile`)
- **Documentation**:
  - Use JSDoc for TypeScript
  - Include prop types and descriptions for components
  - Document API call interfaces
- **Type Annotations**:
  - Use TypeScript types consistently
  - Prefer interfaces over types for public APIs
  - Use utility types (Partial, Pick, Omit) where appropriate

### Backend (Python/FastAPI)
- **Formatting**:
  - 4 spaces for indentation
  - Use Black formatter with default settings
  - 2 blank lines between top-level definitions, 1 between methods
  - Imports: standard library → third-party → local; one import per line
- **Naming**:
  - Variables/Functions: `snake_case`
  - Classes: `PascalCase`
  - Constants: `UPPER_SNAKE_CASE`
  - Private: `_leading_underscore`
- **Documentation**:
  - Use Google-style docstrings
  - Include type hints in docstrings
  - Document API endpoints with OpenAPI annotations
- **Type Annotations**:
  - Use Python type hints consistently
  - Use Pydantic models for API request/response validation
  - Use Optional[] for nullable fields
  - Use Union[] for multiple possible types

### Shared Practices
- **Error Handling**:
  - Use consistent error response formats
  - Include error codes and messages
  - Log errors with appropriate severity levels
- **Security**:
  - Validate all inputs
  - Sanitize outputs
  - Use environment variables for sensitive data
  - Follow OWASP guidelines for web security

---

## Project Goals

### Core Objectives
1. **Creator-Centric Platform**:
   - Enable seamless creator onboarding through Stripe Connect
   - Provide robust payout management tools
   - Implement transparent marketplace fee structure

2. **E-Learning Experience**:
   - Build intuitive lesson creation and management tools
   - Ensure reliable video upload and processing via Vimeo
   - Develop comprehensive lesson metadata management
   - Implement secure purchase and access control systems
   - Create engaging user profiles with progress tracking

3. **Technical Excellence**:
   - Maintain secure authentication via Supabase
   - Ensure reliable payment processing with Stripe
   - Deliver scalable video delivery infrastructure
   - Build maintainable codebase with high test coverage

### Key Features
- **For Creators**:
  - Easy lesson creation and management
  - Integrated video hosting and processing
  - Transparent earnings and payout tracking
  - Marketplace analytics and insights

- **For Learners**:
  - Secure payment processing
  - Reliable video playback
  - Progress tracking and course management
  - Personalized learning experience

### Technical Milestones
1. **Phase 1: Core Infrastructure**
   - Implement Stripe Connect integration
   - Set up Vimeo video processing pipeline
   - Configure Supabase authentication

2. **Phase 2: Marketplace Features**
   - Develop lesson creation tools
   - Implement purchase and access control
   - Build user profile and progress tracking

3. **Phase 3: Optimization & Scaling**
   - Implement performance monitoring
   - Add caching and CDN support
   - Optimize database queries
   - Implement load testing

### Quality Standards
- **Security**:
  - Regular security audits
  - Penetration testing
  - Dependency vulnerability scanning
- **Reliability**:
  - Automated failover with Vercel's infrastructure
  - Comprehensive monitoring through Vercel's analytics
  - Automatic scaling with Vercel's serverless functions
- **Performance**:
  - <2s page load times
  - Scalable to 10,000 concurrent users

## API Design & Implementation

### Backend API Structure
- **Modular Organization**:
  - FastAPI routers for logical separation
  - Base route handler patterns
  - Type-safe configuration management
- **Request Handling**:
  - Pydantic models for validation
  - Consistent error response formats
  - Rate limiting and circuit breakers
- **Webhook Implementation**:
  - Signature verification
  - Idempotency handling
  - Event processing queues

## Testing Guidelines

### Testing Implementation Details

#### Stripe Connect Testing
- Test account creation flows
- Verify onboarding completion
- Test payment calculations
- Verify webhook handling
- Test dispute handling

#### Vimeo Integration Testing
- Test video upload flows
- Verify player integration
- Test event handling
- Verify analytics tracking
- Test error handling

#### Supabase Auth Testing
- Test login/signup flows
- Verify password reset
- Test session management
- Verify protected routes
- Test auth state changes

### Testing Best Practices
- **Webhook Testing**:
  - Verify webhook signatures
  - Test idempotency handling
  - Validate event processing
  - Implement proper error logging
- **API Contract Testing**:
  - Validate request/response schemas
  - Test edge cases for all endpoints
  - Verify error response formats
  - Test rate limiting implementation
- **Security Testing**:
  - Test authentication flows thoroughly
  - Verify authorization checks
  - Test for common vulnerabilities
  - Validate input sanitization
- **Performance Testing**:
  - Test critical endpoints under load
  - Monitor API response times
  - Verify video streaming performance
  - Test database query performance

### Testing Strategy
1. **Test Pyramid Implementation**:
   - Unit tests for individual components
   - Integration tests for API endpoints
   - End-to-end tests for critical user flows

2. **Coverage Requirements**:
   - Minimum 80% test coverage enforced
   - Critical paths require 100% coverage
   - Regular coverage reporting

### Test Types
1. **Unit Tests**:
   - Test individual business logic components
   - Use mocks for external dependencies
   - Focus on edge cases and error conditions

2. **Integration Tests**:
   - Verify API contracts and endpoints
   - Test database interactions
   - Validate Stripe and Vimeo integrations

3. **Security Tests**:
   - Test authentication and authorization flows
   - Verify payment processing security
   - Validate webhook security

4. **Performance Tests**:
   - Test critical endpoints under load
   - Verify video streaming performance
   - Monitor API response times

### Testing Automation
1. **CI/CD Integration**:
   - Pre-commit hooks for linting and tests
   - Automated test execution in pipelines
   - Coverage reporting in CI

2. **Test Organization**:
   - Mirror project structure
   - Use `test_` prefix for test files
   - Group related tests logically
   - Use descriptive test names: `test_<method>_<condition>_<expected_result>`

### Critical Paths Requiring 100% Coverage
1. Payment processing flows
2. Authentication and authorization
3. Video upload and processing
4. Lesson access control
5. Webhook handling

### Testing Best Practices

## Production Considerations

### Infrastructure Details
- **Docker Configuration**:
  - Maintain separate dev/prod configurations
  - Implement proper container networking
  - Use secure environment variable handling
  - Document container startup procedures
- **CI/CD Pipeline**:
  - Configure pytest with coverage thresholds
  - Implement comprehensive linting rules
  - Set up automated deployment workflows
  - Document pipeline troubleshooting
  - Implement proper rollback procedures

### Vercel Deployment Patterns

#### Edge Functions
- Implement serverless API endpoints
- Handle authentication
- Manage rate limiting
- Implement caching
- Handle error responses

#### Preview Deployments
- Configure preview environments
- Manage environment variables
- Handle database connections
- Implement feature flagging
- Manage deployment cleanup

#### Production Workflows
- Configure production deployments
- Implement rollback procedures
- Manage database migrations
- Handle zero-downtime deployments
- Implement monitoring setup

### Reliability & Monitoring
- **Core Features**:
  - Automated failover mechanisms
  - Health checks and status endpoints
  - Rate limiting and circuit breakers
- **Monitoring Setup**:
  - Application performance monitoring
  - Error tracking and alerting
  - Usage analytics and audit logging
  - Database query performance tracking

### Scalability Strategies
- **Horizontal Scaling**:
  - Database connection pooling
  - Load testing procedures
- **Performance Optimization**:
  - CDN integration for static assets
  - Database indexing strategies
  - Query optimization patterns
  - Background task processing

### Interaction Flows
- **Authentication Flow**:
  - Frontend → Supabase API → Backend
  - Session management
  - Token refresh handling
- **Payment Processing**:
  - Frontend → Backend → Stripe Connect API
  - Marketplace fee calculations
  - Split payments implementation
- **Content Creation**:
  - Lesson creation UI → Backend → Vimeo/Supabase
  - Video processing pipeline
  - Metadata storage and retrieval
- **Video Delivery**:
  - Frontend → Vimeo API → Backend
  - Adaptive streaming setup
  - Playback analytics
1. **Frontend Testing**:
   - Use Jest and React Testing Library
   - Test component rendering and interactions
   - Verify API call handling
   - Test auth flows and protected routes

2. **Backend Testing**:
   - Use pytest for FastAPI endpoints
   - Mock external services (Stripe, Vimeo, Supabase)
   - Test webhook handlers thoroughly
   - Verify payment calculations and fee structures

3. **Integration Testing**:
   - Test Stripe Connect onboarding flow
   - Verify Vimeo upload and playback integration
   - Test Supabase auth flows
   - Verify payment processing end-to-end
