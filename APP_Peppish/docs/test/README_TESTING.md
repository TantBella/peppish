# Peppish React App - Testing Guide

## Quick Start

### Run Tests
```bash
# Watch mode (interactive)
npm test

# Run once (CI/CD)
npm test -- --watch=false

# Run specific test file
npm test -- LoginPage.test.tsx

# Run tests matching pattern
npm test -- --testNamePattern="validation"
```

### Build for Production
```bash
# Production build
npm run build

# Start development server
npm start

# Check TypeScript
npx tsc --noEmit
```

---

## Test Files Overview

### 1. **API Client Tests** (`src/services/apiClient.test.ts`)
Tests the Axios instance and its configuration.

**Coverage:**
- ✅ Instance creation and initialization
- ✅ Correct base URL from environment
- ✅ Request and response interceptors present

**Key Verifications:**
- Uses `http://localhost:7099` (from .env)
- Interceptors are configured
- All axios methods available (get, post, put, delete)

---

### 2. **Auth Context Tests** (`src/context/AuthContext.test.tsx`)
Tests authentication context and state management.

**Coverage:**
- ✅ Provider renders without crashing
- ✅ useAuth hook provides auth state
- ✅ Session restoration from localStorage
- ✅ Empty state handling

**Key Verifications:**
- Context provides user, token, isLoading, login, logout
- useAuth hook accessible within provider
- localStorage restoration on mount
- Graceful handling when no stored session

---

### 3. **Login Page Tests** (`src/pages/LoginPage.test.tsx`)
Tests login form rendering and user interactions.

**Coverage:**
- ✅ Form elements render
- ✅ Email and password inputs
- ✅ Submit button
- ✅ Register link
- ✅ User input handling

**Key Verifications:**
- All form fields present
- Field types correct (type="email", type="password")
- Login button exists
- Can update field values
- Link to register page

---

### 4. **Chore List Page Tests** (`src/pages/ChoreListPage.test.tsx`)
Tests chore list rendering and data display.

**Coverage:**
- ✅ Page renders without crashing
- ✅ Week view heading displays
- ✅ Chore list from mock data
- ✅ Chore descriptions visible
- ✅ Multiple chores displayed

**Key Verifications:**
- "Week" text appears on page
- Mock chores render correctly
- Chore titles and descriptions visible
- Data appears in expected format

---

## Manual Testing Guide

See `TESTING_MANUAL.md` for 31 comprehensive manual test cases covering:

### Phase 1: Setup & Architecture (4 tests)
- App loads and initializes
- Router navigation works
- API client configured correctly
- Environment variables loaded

### Phase 2: Authentication (7 tests)
- Email validation works
- Password validation enforced
- Login successful with credentials
- Failed login shows error
- JWT token persisted correctly
- 401 responses trigger logout
- Protected routes redirect properly

### Phase 3: Chore Management (8 tests)
- Week view displays Mon-Sun
- Chores grouped by day
- Status colors correct
- Child can complete assigned chore
- Child cannot complete unassigned
- Adult can approve completed chore
- Child cannot approve (role-based)
- Action panel expands/collapses

### Phase 4: Rewards System (5 tests)
- Balance display shows money
- Progress percentage displays
- Reward history list shows all
- History sorted by date
- Empty state message when no rewards

### Phase 5: Progress Tracking (5 tests)
- Avatar level displays
- XP progress bar shows percentage
- Daily completion stats display
- Progress bars use correct colors
- Multiple stat cards visible

### Error Handling (4 tests)
- Network errors handled gracefully
- Invalid API responses don't crash app
- Form submission prevents duplicates
- Logout clears session properly

---

## Testing Best Practices Used

### Test Structure
```typescript
// 1. Setup
beforeEach(() => {
  localStorage.clear();
  jest.clearAllMocks();
});

// 2. Render with providers
const renderComponent = () => {
  return render(
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <Component />
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
};

// 3. Test assertions
it('should do something', () => {
  renderComponent();
  expect(screen.getByText('expected text')).toBeInTheDocument();
});

// 4. Async assertions
it('should handle async', async () => {
  renderComponent();
  await waitFor(() => {
    expect(screen.getByText('loaded')).toBeInTheDocument();
  });
});
```

### Query Selectors Priority
1. `getByRole` - Most semantic
2. `getByPlaceholderText` - For form fields
3. `getByTestId` - Fallback with data-testid
4. Avoid `getByText` for interactive elements (use getByRole)

### Mocking Strategy
- ✅ Mock external services (API calls)
- ✅ Don't mock context providers
- ✅ Don't mock hooks if possible
- ✅ Use realistic component trees
- ✅ Clear mocks between tests

### Async Testing
```typescript
// Use waitFor for async operations
await waitFor(() => {
  expect(screen.getByText('loaded')).toBeInTheDocument();
});

// Proper timeout
await waitFor(() => {
  expect(element).toBeInTheDocument();
}, { timeout: 1000 });
```

---

## Common Issues & Solutions

### Issue: "Provider not found" error
**Cause:** Component not wrapped with required providers
**Solution:** Ensure component is wrapped with QueryClientProvider, BrowserRouter, AuthProvider

### Issue: "Cannot find module" error
**Cause:** Import path incorrect or file doesn't exist
**Solution:** Check file exists at path, verify extension (.test.ts or .test.tsx)

### Issue: Async test timeout
**Cause:** waitFor timeout too short for API mock response
**Solution:** Increase timeout or check that mock is properly set up

### Issue: localStorage not cleared between tests
**Cause:** beforeEach not called or not clearing properly
**Solution:** Ensure `beforeEach(() => localStorage.clear())` exists

### Issue: TypeScript errors in tests
**Cause:** Missing React import or JSX syntax issue
**Solution:** For JSX files, import React or use React.ReactNode type

---

## Debugging Tests

### Print DOM State
```typescript
// Show current DOM
screen.debug();

// Show specific element
screen.debug(screen.getByRole('button'));

// Get testing playground URL
screen.logTestingPlaygroundURL();
```

### Run Single Test
```bash
npm test -- --testNamePattern="specific test name"
```

### Run Single File
```bash
npm test -- LoginPage.test.tsx
```

### Verbose Output
```bash
npm test -- --verbose
```

### Watch Mode with Pattern
```bash
npm test -- --watch --testNamePattern="Auth"
```

---

## Continuous Integration

### GitHub Actions Example
```yaml
name: Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
      - run: npm ci
      - run: npm test -- --watch=false
      - run: npm run build
```

### Local Pre-commit
```bash
#!/bin/sh
# .git/hooks/pre-commit
npm test -- --watch=false --bail
npm run build
```

---

## Test Coverage

### Current Coverage
- ✅ API Client: 5 test cases
- ✅ Auth Context: 4 test cases
- ✅ Login Page: 6 test cases
- ✅ Chore List: 5 test cases
- ✅ Manual Tests: 31 test cases

### Future Coverage (Recommended)
- Service layer tests (choreService, rewardService)
- Hook tests (useChores, useRewards, useProgress)
- Integration tests with MSW
- E2E tests with Cypress/Playwright
- Error boundary tests

---

## Test Maintenance

### Regular Tasks
- ✅ Update tests when component props change
- ✅ Update mocks when API endpoints change
- ✅ Update selectors if HTML structure changes
- ✅ Add tests for new features
- ✅ Review and update learnings

### When to Add Tests
- New component created
- Bug fixed (add test to prevent regression)
- Feature changes user interaction
- API contract changes
- Validation rules added

### When to Skip Tests
- Trivial UI updates (styling only)
- Third-party library components (already tested)
- Complex E2E flows (use manual tests instead)

---

## Integration Testing with Backend

### Disable Mocks
```typescript
// Remove jest.mock() calls or comment them out
// jest.mock('../services/authService')
```

### Set Real API URL
```bash
# .env
VITE_API_URL=http://localhost:7099
```

### Run Tests Against Live Backend
```bash
# Start backend first
# Then run tests
npm test -- --watch=false
```

### Test Checklist
- [ ] Login with valid credentials
- [ ] Login with invalid credentials shows error
- [ ] JWT token properly attached to requests
- [ ] 401 response triggers logout
- [ ] Chore list loads and displays
- [ ] Can complete chore (correct status)
- [ ] Can approve chore (adult only)
- [ ] Rewards page loads balances
- [ ] Progress page loads avatar data

---

## Performance Testing

### Key Metrics to Monitor
- Component render time
- Network request latency
- Bundle size (from build output)
- Memory usage in DevTools
- React Query cache effectiveness

### Tools
```bash
# Measure performance
npm test -- --detectOpenHandles

# Check bundle size
npm run build (check build/ folder)

# DevTools performance profiler
# Chrome: F12 → Performance tab → Record → Run test
```

---

## Further Reading

- [React Testing Library Docs](https://testing-library.com/docs/react-testing-library/intro/)
- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [React Query Testing](https://tanstack.com/query/latest/docs/react/testing)
- [Testing Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)

---

## Summary

- ✅ **4 unit test files** created and documented
- ✅ **31 manual test cases** defined and organized
- ✅ **Complete testing guide** provided
- ✅ **Debugging tools** explained
- ✅ **Best practices** documented
- ✅ Ready for backend integration testing

**Next Steps:**
1. Run `npm test -- --watch=false` to execute tests
2. Follow TESTING_MANUAL.md for manual testing
3. Integrate with backend and rerun tests
4. Monitor test coverage and add tests for new features
