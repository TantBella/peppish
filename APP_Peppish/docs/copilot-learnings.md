# Copilot Learnings
## Purpose

Project-specific conventions and mistakes to avoid.

## Do NOT
- Do not force language
- Do not rewrite working code without reason
- Do not duplicate documentation
- Do not guess
- Do not ignore patterns
- Do not delete docs

## General
- Do not overengineer
- Always follow DOMAIN.md
- Never mix Template / Assignment / Instance
- Always enforce HouseholdId filtering

## Testing Strategy
- Use xUnit + Moq
- Focus on business rules
- Test service layer
- Avoid mocking DbContext
- Keep tests simple

## Common Mistakes
- Creating rewards before approval
- Skipping service layer
- Exposing EF entities
- Mocking DbContext incorrectly
- Over-testing trivial logic

## Frontend Learnings (Phase 1 - Architecture Setup)

### TypeScript & React Modern Patterns
- Modern React (17+) does NOT require `import React from 'react'` in JSX files
- Use React.ReactNode type for component children, but don't import React itself
- This reduces bundle size and simplifies code

### React Query (TanStack Query) - Data Fetching
- Query keys MUST include all filter parameters: `['chores', { status, assignedTo }]`
- Improper structure: `['chores']` or `['chores', status]` will cause cache misses
- Status mapping MUST happen in custom hooks (useChores), NEVER in components
- Hooks transform API status to UI status: available/assigned → Pending, completed → Completed, approved → Approved

### API Client & Interceptors (Axios)
- Request interceptor: Always attach Bearer token from localStorage before each request
- Response interceptor: Catch 401 status and automatically logout + redirect to /login
- Never hardcode API URLs - use environment variables (REACT_APP_API_URL for react-scripts)
- Create .env and .env.example files for environment configuration

### Architecture: Service Layer Pattern
- Strict data flow: Component → Hook → Service → API
- NEVER call API endpoints directly in components
- Services return raw data, hooks transform and cache it
- Components receive already-transformed data from hooks

### React Router v6 Specific
- Use `element` prop (not `component` prop like v5)
- Navigate component for programmatic redirects
- ProtectedRoute wrapper pattern for auth enforcement
- Check user.isLoading state before rendering to prevent flashing

### Auth Context & State Management
- Store token AND user object in localStorage together
- useAuth hook prevents duplication of auth logic across components
- Logout function should clear BOTH token and user from storage
- Context provider checks localStorage on mount to restore session

### TypeScript Strict Mode Benefits
- No `any` types allowed - catch type mismatches at compile time
- All API responses must be typed (reduces runtime errors)
- Compilation ensures type safety before runtime

## Frontend Learnings (Phase 2 - Authentication)

### Form Validation & Error Handling
- Real-time error clearing: Clear error when user starts typing in field
- Separate error states: Field-level errors (email, password, etc.) + submit-level errors (API errors)
- Only show error message when user has interacted with field OR submitted form
- Disable form inputs during submission to prevent double-submit

### Form Validation Patterns
- Extract validation logic into separate function (validateForm) for clarity
- Validate all fields before any state update
- Collect all errors, then setErrors once (batch update)
- Show validation errors inline with focus states

### Email Validation
- Use regex pattern: `/^[^\s@]+@[^\s@]+\.[^\s@]+$/` for basic validation
- Backend should always validate too (never trust client)

### JWT Token Management
- Store both token AND user object together in localStorage
- Token must be retrieved on app mount (useEffect in AuthProvider)
- Always clear BOTH on logout to prevent stale auth state
- Use axios request interceptor to auto-add token to every request: `Authorization: Bearer ${token}`

### Protected Routes & Role-Based Access
- ProtectedRoute component should check isLoading first (prevents UI flash)
- Redirect pattern: No auth → /login, Wrong role → /home
- Role prop is optional: Some routes allow any authenticated user
- Always validate role on backend (frontend role checks are UX only)

### Axios Interceptors Pitfall
- Response interceptor catches all errors including network failures
- 401 error should trigger logout + redirect immediately
- Other errors should be passed to component for handling
- Ensure interceptor doesn't interfere with normal error flow

### Form Input States
- Inputs should disable during submission (disabled={isLoading})
- Button text should change: "Login" → "Logging in..."
- Input border/focus states for visual feedback
- Focus management: Focus first error field or show summary

## Original Learnings
- Split large components early
- Prefer local state
- Define types BEFORE logic