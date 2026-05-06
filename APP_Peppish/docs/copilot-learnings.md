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

## Frontend Learnings (Phase 4 - Rewards Display)

### Displaying Aggregated Data
- Balance endpoint returns totals: totalMoney and totalProgress
- Use CSS Grid for card layout: `grid-template-columns: repeat(auto-fit, minmax(200px, 1fr))`
- Format currency: `toFixed(2)` for money values
- Color coding by type: green = money, yellow = progress, blue = default

### List Display Patterns
- Reward history shows: icon + value + date
- Date formatting: `new Date(isoString).toLocaleDateString()`
- Show empty state message when list is empty
- Use flexbox for list items: align-items center, gap between elements

### Service Layer for Non-Chore Data
- Rewardservice is separate from choreService
- Both follow same pattern: simple GET requests through apiClient
- Hook layer (useRewards) handles caching + error handling
- Components only use hooks, never call services directly

### CSS Styling for Data Display
- Card-based layout for dashboard-style pages
- Border colors: left border indicates type (green, yellow, blue)
- Icons: Use emoji or text symbols ($, ⭐)
- Spacing: Consistent margins between sections (gap: 1.5rem, 2rem)



### Calendar/Week View Patterns
- Calculate Monday of current week: `const diff = now.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1)`
- Use CSS Grid for responsive day columns: `grid-template-columns: repeat(auto-fit, minmax(150px, 1fr))`
- Group data by day using date ISO strings as keys for consistency
- Display format: Short day name (Mon, Tue) + date (Jan 15)

### React Query Mutations for State Changes
- Use useMutation for POST/PATCH endpoints (not useQuery)
- Must provide: mutationFn (the API call) + onSuccess/onError handlers
- onSuccess should: (1) invalidate related queries, (2) show success state
- onError should: catch and display error message from API
- Key pattern: invalidateQueries with queryKey to refresh data

### Action Authorization Patterns
- Determine which actions to show based on: chore.status + user.role
- Button visibility: Only show if user CAN perform action
- Status badges: Show Pending/Completed/Approved with color coding
- Fallback UI: Show status message if no action available

### CSS Classes for Dynamic Styling
- Use class names to reflect state: `.status-pending`, `.status-completed`, `.status-approved`
- Use data attributes or CSS classes for role-based visibility
- Example: `.btn-complete` for child actions, `.btn-approve` for adult actions
- Color coding: yellow (pending), blue (completed), green (approved)

### Expandable Card Pattern
- Track expanded state in parent component: `const [expandedChoreId, setExpandedChoreId]`
- Show/hide child components conditionally based on expanded state
- Toggle handler: `setExpandedChoreId(id === expandedId ? null : id)`
- Keep single card expanded at a time for UX clarity

### Chore Status Rules (Domain Constraint)
- Pending: Available or assigned (can be completed by assignee)
- Completed: Waiting for adult approval (cannot complete again)
- Approved: Final state (no further actions available)
- No role can skip steps: must go Pending → Completed → Approved

## Frontend Learnings (Phase 3 - Chores List & Actions)

### Calendar/Week View Patterns
- Calculate Monday of current week: `const diff = now.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1)`
- Use CSS Grid for responsive day columns: `grid-template-columns: repeat(auto-fit, minmax(150px, 1fr))`
- Group data by day using date ISO strings as keys for consistency
- Display format: Short day name (Mon, Tue) + date (Jan 15)

### React Query Mutations for State Changes
- Use useMutation for POST/PATCH endpoints (not useQuery)
- Must provide: mutationFn (the API call) + onSuccess/onError handlers
- onSuccess should: (1) invalidate related queries, (2) show success state
- onError should: catch and display error message from API
- Key pattern: invalidateQueries with queryKey to refresh data

### Action Authorization Patterns
- Determine which actions to show based on: chore.status + user.role
- Button visibility: Only show if user CAN perform action
- Status badges: Show Pending/Completed/Approved with color coding
- Fallback UI: Show status message if no action available

### CSS Classes for Dynamic Styling
- Use class names to reflect state: `.status-pending`, `.status-completed`, `.status-approved`
- Use data attributes or CSS classes for role-based visibility
- Example: `.btn-complete` for child actions, `.btn-approve` for adult actions
- Color coding: yellow (pending), blue (completed), green (approved)

### Expandable Card Pattern
- Track expanded state in parent component: `const [expandedChoreId, setExpandedChoreId]`
- Show/hide child components conditionally based on expanded state
- Toggle handler: `setExpandedChoreId(id === expandedId ? null : id)`
- Keep single card expanded at a time for UX clarity

## Frontend Learnings (Phase 5 - Progress Visualization)

### Progress Bars
- Calculate percentage: `(current / max) * 100`
- Use inline styles for dynamic width: `style={{ width: ${percentage}% }}`
- CSS transitions smooth bar fill: `transition: width 0.3s ease`
- Gradient backgrounds: `linear-gradient(90deg, #007bff, #0056b3)`
- Different colors for different types: blue for avatar XP, green for daily progress

### Level & Experience Display
- Show current level with badge styling
- Display experience text: "X / Y XP"
- Avatar placeholder uses emoji for visual appeal
- Calculate progress percentage for bar visualization

### Statistics Layout
- Use CSS Grid for flexible stat display: `grid-template-columns: repeat(auto-fit, minmax(150px, 1fr))`
- Center text with `text-align: center`
- Large value font size (2rem) with bold weight
- Label font size smaller (0.9rem) in gray color (#666)

### Daily vs Avatar Data
- Daily progress: completed / total chores ratio
- Avatar progress: experience / max experience ratio
- Both show percentage-based progress bars
- Daily stats include: completed, approved, total counts
