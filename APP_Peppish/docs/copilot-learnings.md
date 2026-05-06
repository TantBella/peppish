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

## Original Learnings
- Split large components early
- Prefer local state
- Define types BEFORE logic