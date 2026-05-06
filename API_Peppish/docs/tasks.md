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

* [X] Verify project builds successfully
* [X] Add required NuGet packages:

  * Microsoft.AspNetCore.Identity.EntityFrameworkCore
  * Microsoft.EntityFrameworkCore.SqlServer
  * Microsoft.EntityFrameworkCore.Design
* [X] Create folder structure:

  * /Controllers
  * /Services
  * /Repositories
  * /Entities
  * /DTOs
  * /Data
* [X] Configure connection string in appsettings.json

---

# Phase 1 – Identity & Database

* [X] Create `ApplicationUser` extending IdentityUser

  * Add: DisplayName, HouseholdId
* [X] Create `AppDbContext` extending IdentityDbContext<ApplicationUser>
* [X] Register DbContext in Program.cs
* [X] Add Identity configuration in Program.cs
* [X] Run initial migration
* [X] Verify database is created

---

# Phase 2 – Core Entities

Create entities EXACTLY as defined in DOMAIN.md

* [X] Household
* [X] ChoreTemplate
* [X] ChoreAssignment
* [X] ChoreInstance
* [X] RewardLedger
* [X] AvatarProgress

Rules:

* Include Id (Guid)
* Include HouseholdId where required
* Include timestamps where relevant
* NO business logic inside entities

---

# Phase 3 – DbContext Integration

* [X] Add DbSets for all entities
* [X] Configure relationships using Fluent API
* [X] Add constraints:

  * FK: User → Household
  * FK: Assignment → Template
  * FK: Instance → Assignment
* [X] Run migration: AddDomainEntities
* [X] Update database

---

# Phase 4 – Repositories

Each repository MUST:

- Expose only necessary methods (no generic CRUD dump)
- Use async methods
- Always filter by HouseholdId where applicable
- Never return IQueryable outside repository

* [X] HouseholdRepository
* [X] ChoreTemplateRepository
* [X] ChoreAssignmentRepository
* [X] ChoreInstanceRepository
* [X] RewardRepository

Rules:

* Only data access
* Async methods only
* No business logic

---

# Phase 5 – Services (Core Logic)

Create services:

* [X] UserService
* [X] HouseholdService
* [X] ChoreTemplateService
* [X] ChoreAssignmentService
* [X] ChoreInstanceService
* [X] RewardService
* [X] ProgressService

---

## Critical Service Implementations

### ChoreInstanceService

* [X] Get chores by date range

* [X] Generate instances (on-demand)

* [X] Complete chore:

  * Validate assigned user
  * Set status → Completed
  * Set CompletedAt

* [X] Approve chore:

  * Validate Adult role
  * Set status → Approved
  * Set ApprovedAt
  * Call RewardService

---

### RewardService

* [X] Create reward ONLY on Approved chore
* [X] Add entry to RewardLedger
* [X] Ensure no duplicate rewards

---

### ProgressService

* [X] Calculate daily progress:

  * completed / total * 100
* [X] Update AvatarProgress on approval

---

# Phase 6 – DTOs

Create DTOs for ALL responses

* [X] UserDto
* [X] HouseholdDto
* [X] ChoreTemplateDto
* [X] ChoreAssignmentDto
* [X] ChoreInstanceDto
* [X] RewardDto
* [X] ProgressDto

Rules:

* No navigation properties
* Flat structure only

---

# Phase 7 – Controllers

Implement controllers strictly following api-spec.md

---

## AuthController

* [X] POST /auth/register
* [X] POST /auth/login
* [X] Return JWT token

---

## UsersController

* [X] GET /users/me
* [X] GET /users/{id}/rewards
* [X] GET /users/{id}/balance
* [X] GET /users/{id}/progress

---

## HouseholdsController

* [X] GET /households/{id}

---

## ChoreTemplatesController

* [X] POST /chore-templates
* [X] GET /chore-templates

---

## ChoreAssignmentsController

* [X] POST /chore-assignments
* [X] GET /users/{userId}/assignments

---

## ChoreInstancesController

* [X] GET /chores?from=&to=
* [X] POST /chores/{id}/complete
* [X] POST /chores/{id}/approve

---

# Phase 8 – Authorization

* [X] Add role-based authorization:

  * Adult
  * Child
* [X] Protect endpoints with [Authorize]
* [X] Enforce rules in services:

  * Child cannot approve
  * Only assigned user can complete

---

# Phase 9 – Household Isolation

* [X] Ensure ALL queries filter by HouseholdId
* [X] Validate user belongs to household before access
* [X] Prevent cross-household data leaks

---

# Phase 10 – Validation

* [X] Validate all incoming DTOs
* [X] Return standard error format
* [X] Handle invalid states:

  * Completing already completed task
  * Approving non-completed task

---

# Phase 11 – Logging

* [X] Log:

  * approvals
  * reward creation
  * unauthorized access attempts

---

# Phase 12 – Testing (Core Only)

* [X] Unit tests for:

  * reward creation
  * approval flow
  * chore completion
  * household isolation

---

# Phase 13 – Final Verification

* [X] All endpoints match API-SPEC.md
* [X] All rules from DOMAIN.md are enforced
* [X] No business logic in controllers
* [X] Rewards only created after approval
* [X] Application runs without errors

---

# Future (Not in MVP)

* [ ] Background job for instance generation
* [ ] Notifications
* [ ] Avatar animations
* [ ] Streak system
* [ ] Leaderboard
