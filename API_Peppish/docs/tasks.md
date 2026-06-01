# TASKS – Backend (api_peppish)

## Execution Protocol (STRICT)

For EVERY task:

1. Read domain.md and api-spec.md for context
2. Identify exact entities and rules involved
3. Implement ONLY the current task scope
4. Ensure code compiles
5. Add necessary DTOs/interfaces
6. Verify no architectural violations
7. Mark task complete ONLY if fully working

DO NOT:

- Skip ahead to future tasks
- Implement partial logic
- Combine multiple tasks
- Invent missing requirements

---

## Definition of Done

A task is complete ONLY if:

- Code compiles
- Follows architecture rules
- Domain rules are enforced
- No TODOs remain
- Endpoint (if applicable) works end-to-end

---

# Phase 0 – Project Setup

- [x] Verify project builds successfully
- [x] Add required NuGet packages:
  - Microsoft.AspNetCore.Identity.EntityFrameworkCore
  - Npgsql.EntityFrameworkCore.PostgreSQL
  - Microsoft.EntityFrameworkCore.Design

- [x] Create folder structure:
  - /Controllers
  - /Services
  - /Repositories
  - /Entities
  - /DTOs
  - /Data

- [x] Configure connection string in appsettings.json

---

# Phase 1 – Identity & Database

- [x] Create `ApplicationUser` extending IdentityUser
  - Add: DisplayName, HouseholdId

- [x] Create `AppDbContext` extending IdentityDbContext<ApplicationUser>
- [x] Register DbContext in Program.cs
- [x] Add Identity configuration in Program.cs
- [x] Run initial migration
- [x] Verify database is created

---

# Phase 2 – Core Entities

Create entities EXACTLY as defined in DOMAIN.md

- [x] Household
- [x] ChoreTemplate
- [x] ChoreAssignment
- [x] ChoreInstance
- [x] RewardLedger
- [x] AvatarProgress

Rules:

- Include Id (Guid)
- Include HouseholdId where required
- Include timestamps where relevant
- NO business logic inside entities

---

# Phase 3 – DbContext Integration

- [x] Add DbSets for all entities
- [x] Configure relationships using Fluent API
- [x] Add constraints:
  - FK: User → Household
  - FK: Assignment → Template
  - FK: Instance → Assignment

- [x] Run migration: AddDomainEntities
- [x] Update database

---

# Phase 4 – Repositories

Each repository MUST:

- Expose only necessary methods (no generic CRUD dump)
- Use async methods
- Always filter by HouseholdId where applicable
- Never return IQueryable outside repository

* [x] HouseholdRepository
* [x] ChoreTemplateRepository
* [x] ChoreAssignmentRepository
* [x] ChoreInstanceRepository
* [x] RewardRepository

Rules:

- Only data access
- Async methods only
- No business logic

---

# Phase 5 – Services (Core Logic)

Create services:

- [x] UserService
- [x] HouseholdService
- [x] ChoreTemplateService
- [x] ChoreAssignmentService
- [x] ChoreInstanceService
- [x] RewardService
- [x] ProgressService

---

## Critical Service Implementations

### ChoreInstanceService

- [x] Get chores by date range

- [x] Generate instances (on-demand)

- [x] Complete chore:
  - Validate assigned user
  - Set status → Completed
  - Set CompletedAt

- [x] Approve chore:
  - Validate Adult role
  - Set status → Approved
  - Set ApprovedAt
  - Call RewardService

---

### RewardService

- [x] Create reward ONLY on Approved chore
- [x] Add entry to RewardLedger
- [x] Ensure no duplicate rewards

---

### ProgressService

- [x] Calculate daily progress:
  - completed / total \* 100

- [x] Update AvatarProgress on approval

---

# Phase 6 – DTOs

Create DTOs for ALL responses

- [x] UserDto
- [x] HouseholdDto
- [x] ChoreTemplateDto
- [x] ChoreAssignmentDto
- [x] ChoreInstanceDto
- [x] RewardDto
- [x] ProgressDto

Rules:

- No navigation properties
- Flat structure only

---

# Phase 7 – Controllers

Implement controllers strictly following api-spec.md

---

## AuthController

- [x] POST /auth/register
- [x] POST /auth/login
- [x] Return JWT token

---

## UsersController

- [x] GET /users/me
- [x] GET /users/{id}/rewards
- [x] GET /users/{id}/balance
- [x] GET /users/{id}/progress

---

## HouseholdsController

- [x] GET /households/{id}

---

## ChoreTemplatesController

- [x] POST /chore-templates
- [x] GET /chore-templates

---

## ChoreAssignmentsController

- [x] POST /chore-assignments
- [x] GET /users/{userId}/assignments

---

## ChoreInstancesController

- [x] GET /chores?from=&to=
- [x] POST /chores/{id}/complete
- [x] POST /chores/{id}/approve

---

# Phase 8 – Authorization

- [x] Add role-based authorization:
  - Adult
  - Child

- [x] Protect endpoints with [Authorize]
- [x] Enforce rules in services:
  - Child cannot approve
  - Only assigned user can complete

---

# Phase 9 – Household Isolation

- [x] Ensure ALL queries filter by HouseholdId
- [x] Validate user belongs to household before access
- [x] Prevent cross-household data leaks

---

# Phase 10 – Validation

- [x] Validate all incoming DTOs
- [x] Return standard error format
- [x] Handle invalid states:
  - Completing already completed task
  - Approving non-completed task

---

# Phase 11 – Logging

- [x] Log:
  - approvals
  - reward creation
  - unauthorized access attempts

---

# Phase 12 – Testing (Core Only)

- [x] Unit tests for:
  - reward creation
  - approval flow
  - chore completion
  - household isolation

---

# Phase 13 – Final Verification

- [x] All endpoints match API-SPEC.md
- [x] All rules from DOMAIN.md are enforced
- [x] No business logic in controllers
- [x] Rewards only created after approval
- [x] Application runs without errors

---

# Future (Not in MVP)

- [ ] Background job for instance generation
- [ ] Notifications
- [ ] Avatar animations
- [ ] Streak system
- [ ] Leaderboard

# Phase 14 – Production Readiness & Missing MVP Features

## Authentication

### Refresh Tokens

- [ ] Implement refresh token support
- [ ] Store refresh tokens securely
- [ ] Add refresh token entity
- [ ] Add token expiration handling
- [ ] POST /auth/refresh
- [ ] POST /auth/logout

Rules:

- Access tokens must be short-lived
- Refresh tokens must be revocable
- Logout must invalidate refresh token

---

## Rewards Catalog

### New Entities

- [ ] Create Reward entity
- [ ] Create RewardRedemption entity

Reward fields:

- Id
- HouseholdId
- Name
- Description
- Cost
- IsActive
- CreatedAt

RewardRedemption fields:

- Id
- RewardId
- UserId
- RedeemedAt
- Status

Rules:

- Rewards belong to a household
- Only adults can create rewards
- Children can redeem rewards
- User must have sufficient balance

---

## Reward Endpoints

### RewardsController

- [ ] POST /rewards
- [ ] GET /rewards
- [ ] PUT /rewards/{id}
- [ ] DELETE /rewards/{id}
- [ ] POST /rewards/{id}/redeem
- [ ] GET /users/{id}/redemptions

Rules:

- Household isolation required
- Redemption must create ledger entry
- Insufficient balance must return validation error

---

## Household Management

### Household Creation

- [ ] POST /households
- [ ] Create initial household during registration (optional)

### Household Membership

- [ ] Generate invite code
- [ ] POST /households/join
- [ ] Validate invite code
- [ ] Add user to household

Rules:

- User may only belong to one household
- Invite codes must expire
- Household membership must be validated

---

## Entity Improvements

### Audit Fields

- [ ] Add CreatedAt to all aggregate entities
- [ ] Add UpdatedAt to mutable entities

Applies to:

- Household
- ChoreTemplate
- ChoreAssignment
- Reward
- AvatarProgress

---

## Soft Delete

- [ ] Add IsDeleted
- [ ] Add DeletedAt

Applies to:

- ChoreTemplate
- Reward
- ChoreAssignment

Rules:

- Deleted records should not appear in queries
- Physical deletion should be avoided

---

## Pagination

- [ ] Add page parameter
- [ ] Add pageSize parameter

Applies to:

- GET /chores
- GET /chore-templates
- GET /rewards

Rules:

- Default page size = 25
- Maximum page size = 100

---

## Concurrency

### Optimistic Concurrency

- [ ] Add RowVersion to mutable entities
- [ ] Handle concurrent approvals

Rules:

- Prevent duplicate reward creation
- Prevent duplicate approvals

---

## Integration Testing

- [ ] Auth integration tests
- [ ] Household isolation integration tests
- [ ] Chore completion integration tests
- [ ] Chore approval integration tests
- [ ] Reward redemption integration tests

---

## Deployment Readiness

### Configuration

- [ ] Environment-specific settings
- [ ] Connection strings via environment variables
- [ ] Secrets not stored in source control

### API Infrastructure

- [ ] HTTPS enforcement
- [ ] Production CORS configuration
- [ ] Global exception handling middleware
- [ ] Health endpoint (/health)

### Logging

- [ ] Structured logging
- [ ] Correlation IDs
- [ ] Request logging

### Containerization

- [ ] Create Dockerfile
- [ ] Verify production container build

---

## Database Portability

### PostgreSQL Compatibility

- [ ] Add PostgreSQL provider support
- [ ] Verify EF Core migrations
- [ ] Verify compatibility with Neon PostgreSQL

Rules:

- Application should run on PostgreSQL
- No provider-specific business logic
