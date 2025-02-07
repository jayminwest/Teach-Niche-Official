# Frontend Test Coverage Improvement Plan

## Priority 1: Critical Path Components (Week 1-2)

### Authentication & Context
- [ ] AuthContext.tsx (0% → 90%)
  - Test user session management
  - Test authentication state changes
  - Test profile updates
  - Mock Supabase auth calls

- [ ] Auth.tsx (0% → 90%)
  - Test email input validation
  - Test sign in flow
  - Test error handling
  - Mock Supabase calls

### Payment & API Routes
- [ ] checkout_session.ts (0% → 90%)
  - Test session creation
  - Test error handling
  - Mock Stripe API calls

- [ ] verify-session.ts (0% → 90%)
  - Test session verification
  - Test invalid session handling
  - Mock Stripe verification calls

## Priority 2: Core Components (Week 2-3)

### Content Components
- [ ] LessonCard.tsx (72% → 90%)
  - Test purchase click handler
  - Test date formatting
  - Test prop variations

- [ ] Section.tsx (0% → 80%)
  - Test title/subtitle rendering
  - Test children rendering
  - Test style props

## Priority 3: Page Components (Week 3-4)

### Main Pages
- [ ] index.tsx (0% → 80%)
  - Test page rendering
  - Test lesson list
  - Test loading states

- [ ] lessons.tsx (54% → 90%)
  - Test filtering
  - Test sorting
  - Test pagination
  - Test search functionality

### Auth Pages
- [ ] login.tsx (0% → 90%)
- [ ] signup.tsx (0% → 90%)
- [ ] reset-password.tsx (0% → 90%)
  - Test form submissions
  - Test validation
  - Test error states
  - Mock auth calls

## Priority 4: Supporting Components (Week 4-5)

### UI Components
- [ ] Hero.tsx (0% → 80%)
- [ ] Footer.tsx (0% → 80%)
  - Test rendering
  - Test responsive behavior
  - Test link functionality

## Implementation Strategy

### Testing Tools
- Jest for unit/integration tests
- React Testing Library for component tests
- MSW for API mocking
- jest-dom for DOM assertions

### Test Types
1. Unit Tests
   - Pure functions
   - Utility methods
   - Hooks

2. Integration Tests
   - Component interactions
   - Context providers
   - API calls

3. Snapshot Tests
   - UI components
   - Page layouts

### Best Practices
- Mock external services (Supabase, Stripe)
- Test error scenarios
- Test loading states
- Test edge cases
- Use meaningful test descriptions
- Follow AAA pattern (Arrange, Act, Assert)

### Coverage Goals
- Statements: 12% → 80%
- Branches: 13% → 80%
- Functions: 12% → 80%
- Lines: 12% → 80%

## Monitoring & Reporting
- Daily coverage reports
- Weekly progress review
- Blocking PR merges on coverage decrease
- Documentation of test patterns and examples

## Dependencies to Add
- @testing-library/react-hooks
- @testing-library/user-event
- msw
- jest-environment-jsdom
- @testing-library/jest-dom

## Commands for Test Execution
```bash
# Run all tests
npm test

# Run tests with coverage
npm test -- --coverage

# Run tests in watch mode
npm test -- --watch

# Run specific test file
npm test -- AuthContext.test.tsx
```

## Frontend-to-Backend Migration Plan

### Current Frontend Operations to Move

1. **Authentication Operations**
   - Direct Supabase Auth calls in Auth.tsx
   - OTP sign-in handling
   - Session management in AuthContext.tsx
   - Token refresh logic
   - Password reset flows

2. **Payment Processing**
   - Stripe checkout session creation
   - Session verification
   - Payment success/failure handling
   - Subscription management

3. **Profile Management**
   ```typescript
   // Currently managed in frontend
   interface Profile {
     id: string
     full_name: string
     email: string
     avatar_url?: string
     bio?: string
     social_media_tag?: string
     stripe_account_id?: string
     stripe_onboarding_complete: boolean
   }
   ```

4. **Direct Database Operations**
   - Lesson data fetching
   - User profile updates
   - Purchase history tracking
   - Creator profile management

### Backend Implementation Plan

1. **New Auth Endpoints Needed**
   ```python
   @router.post("/auth/login")
   async def login(credentials: LoginSchema)

   @router.post("/auth/signup")
   async def signup(user_data: SignupSchema)

   @router.post("/auth/reset-password")
   async def reset_password(email: str)

   @router.get("/auth/session")
   async def get_session()

   @router.post("/auth/refresh")
   async def refresh_token()
   ```

2. **Profile Management Endpoints**
   ```python
   @router.get("/profile")
   async def get_profile()

   @router.patch("/profile")
   async def update_profile(profile: ProfileUpdateSchema)

   @router.post("/profile/avatar")
   async def update_avatar(file: UploadFile)
   ```

3. **Payment & Subscription Endpoints**
   ```python
   @router.post("/payments/checkout")
   async def create_checkout_session()

   @router.post("/payments/verify")
   async def verify_payment(session_id: str)

   @router.get("/subscriptions")
   async def get_subscriptions()
   ```

4. **Content Management Endpoints**
   ```python
   @router.get("/lessons")
   async def get_lessons()

   @router.post("/lessons")
   async def create_lesson(lesson: LessonCreateSchema)

   @router.get("/lessons/{lesson_id}")
   async def get_lesson(lesson_id: str)
   ```

### Migration Strategy

1. **Phase 1: Authentication**
   - Create backend auth endpoints
   - Update frontend to use new endpoints
   - Migrate session management
   - Test auth flows end-to-end

2. **Phase 2: Profile Management**
   - Implement profile endpoints
   - Move profile logic to backend
   - Update frontend components
   - Add proper validation

3. **Phase 3: Payments**
   - Move Stripe logic to backend
   - Create payment endpoints
   - Update checkout flow
   - Test payment scenarios

4. **Phase 4: Content**
   - Implement lesson endpoints
   - Move content management
   - Update frontend data fetching
   - Add caching layer

### Security Improvements

1. **API Security**
   - JWT validation
   - Rate limiting
   - Request validation
   - CORS configuration

2. **Data Protection**
   - Move all API keys to backend
   - Implement proper encryption
   - Secure file uploads
   - Input sanitization

3. **Session Management**
   - Secure session handling
   - Token refresh mechanism
   - Session invalidation
   - Activity tracking

### Testing Strategy

1. **Backend Tests**
   - Unit tests for new endpoints
   - Integration tests for auth flows
   - Payment processing tests
   - API contract tests

2. **Frontend Tests**
   - Update existing tests
   - Mock API calls
   - Test error scenarios
   - E2E testing updates
