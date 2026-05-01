# TASKS – Backend (api_peppish)

## Execution Protocol (STRICT)

For EVERY task:

1. Read DOMAIN.md and API-SPEC.md for context
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

* [ ] Verify project builds successfully
* [ ] Add required NuGet packages:

  * Microsoft.AspNetCore.Identity.EntityFrameworkCore
  * Microsoft.EntityFrameworkCore.SqlServer
  * Microsoft.EntityFrameworkCore.Design
* [ ] Create folder structure:

  * /Controllers
  * /Services
  * /Repositories
  * /Entities
  * /DTOs
  * /Data
* [ ] Configure connection string in appsettings.json

---

# Phase 1 – Identity & Database

* [ ] Create `ApplicationUser` extending IdentityUser

  * Add: DisplayName, HouseholdId
* [ ] Create `AppDbContext` extending IdentityDbContext<ApplicationUser>
* [ ] Register DbContext in Program.cs
* [ ] Add Identity configuration in Program.cs
* [ ] Run initial migration
* [ ] Verify database is created

---

# Phase 2 – Core Entities

Create entities EXACTLY as defined in DOMAIN.md

* [ ] Household
* [ ] ChoreTemplate
* [ ] ChoreAssignment
* [ ] ChoreInstance
* [ ] RewardLedger
* [ ] AvatarProgress

Rules:

* Include Id (Guid)
* Include HouseholdId where required
* Include timestamps where relevant
* NO business logic inside entities

---

# Phase 3 – DbContext Integration

* [ ] Add DbSets for all entities
* [ ] Configure relationships using Fluent API
* [ ] Add constraints:

  * FK: User → Household
  * FK: Assignment → Template
  * FK: Instance → Assignment
* [ ] Run migration: AddDomainEntities
* [ ] Update database

---

# Phase 4 – Repositories

Each repository MUST:

- Expose only necessary methods (no generic CRUD dump)
- Use async methods
- Always filter by HouseholdId where applicable
- Never return IQueryable outside repository

* [ ] HouseholdRepository
* [ ] ChoreTemplateRepository
* [ ] ChoreAssignmentRepository
* [ ] ChoreInstanceRepository
* [ ] RewardRepository

Rules:

* Only data access
* Async methods only
* No business logic

---

# Phase 5 – Services (Core Logic)

Create services:

* [ ] UserService
* [ ] HouseholdService
* [ ] ChoreTemplateService
* [ ] ChoreAssignmentService
* [ ] ChoreInstanceService
* [ ] RewardService
* [ ] ProgressService

---

## Critical Service Implementations

### ChoreInstanceService

* [ ] Get chores by date range

* [ ] Generate instances (on-demand)

* [ ] Complete chore:

  * Validate assigned user
  * Set status → Completed
  * Set CompletedAt

* [ ] Approve chore:

  * Validate Adult role
  * Set status → Approved
  * Set ApprovedAt
  * Call RewardService

---

### RewardService

* [ ] Create reward ONLY on Approved chore
* [ ] Add entry to RewardLedger
* [ ] Ensure no duplicate rewards

---

### ProgressService

* [ ] Calculate daily progress:

  * completed / total * 100
* [ ] Update AvatarProgress on approval

---

# Phase 6 – DTOs

Create DTOs for ALL responses

* [ ] UserDto
* [ ] HouseholdDto
* [ ] ChoreTemplateDto
* [ ] ChoreAssignmentDto
* [ ] ChoreInstanceDto
* [ ] RewardDto
* [ ] ProgressDto

Rules:

* No navigation properties
* Flat structure only

---

# Phase 7 – Controllers

Implement controllers strictly following API-SPEC.md

---

## AuthController

* [ ] POST /auth/register
* [ ] POST /auth/login
* [ ] Return JWT token

---

## UsersController

* [ ] GET /users/me
* [ ] GET /users/{id}/rewards
* [ ] GET /users/{id}/balance
* [ ] GET /users/{id}/progress

---

## HouseholdsController

* [ ] GET /households/{id}

---

## ChoreTemplatesController

* [ ] POST /chore-templates
* [ ] GET /chore-templates

---

## ChoreAssignmentsController

* [ ] POST /chore-assignments
* [ ] GET /users/{userId}/assignments

---

## ChoreInstancesController

* [ ] GET /chores?from=&to=
* [ ] POST /chores/{id}/complete
* [ ] POST /chores/{id}/approve

---

# Phase 8 – Authorization

* [ ] Add role-based authorization:

  * Adult
  * Child
* [ ] Protect endpoints with [Authorize]
* [ ] Enforce rules in services:

  * Child cannot approve
  * Only assigned user can complete

---

# Phase 9 – Household Isolation

* [ ] Ensure ALL queries filter by HouseholdId
* [ ] Validate user belongs to household before access
* [ ] Prevent cross-household data leaks

---

# Phase 10 – Validation

* [ ] Validate all incoming DTOs
* [ ] Return standard error format
* [ ] Handle invalid states:

  * Completing already completed task
  * Approving non-completed task

---

# Phase 11 – Logging

* [ ] Log:

  * approvals
  * reward creation
  * unauthorized access attempts

---

# Phase 12 – Testing (Core Only)

* [ ] Unit tests for:

  * reward creation
  * approval flow
  * chore completion
  * household isolation

---

# Phase 13 – Final Verification

* [ ] All endpoints match API-SPEC.md
* [ ] All rules from DOMAIN.md are enforced
* [ ] No business logic in controllers
* [ ] Rewards only created after approval
* [ ] Application runs without errors

---

# Future (Not in MVP)

* [ ] Background job for instance generation
* [ ] Notifications
* [ ] Avatar animations
* [ ] Streak system
* [ ] Leaderboard
