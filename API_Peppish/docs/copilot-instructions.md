# Copilot Instructions – Backend API (.NET)

## 1. Purpose of This File

This file defines strict implementation rules for the backend API.

It MUST be treated as the **highest authority for code generation**, second only to `domain.md`.

If there is any conflict:

1. domain.md (business rules)
2. copilot-instructions.md (implementation rules)
3. api-spec.md (endpoint contract)

---

## 2. Tech Stack (Mandatory)

* .NET 8 Web API
* Entity Framework Core
* SQL Server
* ASP.NET Identity for authentication
* RESTful API architecture

No other frameworks or architectural deviations are allowed unless explicitly stated.

---

## 3. Architecture Rules

### 3.1 Layered Architecture (Strict)

The system MUST follow:

* Controllers → API layer only (no business logic)
* Services → ALL business logic
* Repositories → Data access only
* DbContext → EF Core persistence

---

### 3.2 Forbidden Patterns

* No business logic in controllers
* No direct DbContext usage in controllers
* No cross-service logic inside controllers
* No skipping service layer
* No duplicated reward logic inside task logic

---

## 4. Domain Enforcement Rules (Critical)

All code MUST strictly follow `domain.md`.

### 4.1 Core Concept Separation (MANDATORY)

You MUST NEVER merge these concepts:

* ChoreTemplate = definition only
* ChoreAssignment = responsibility only
* ChoreInstance = execution (actual task occurrence)

Any deviation is considered a design violation.

---

### 4.2 Task Lifecycle Rules

* Only ChoreInstance can have status changes
* Only ChoreInstance can be completed
* Only ChoreInstance can be approved
* ChoreTemplate and ChoreAssignment are immutable in runtime logic

---

### 4.3 Reward Rules (Strict)

* Rewards are ONLY created from **approved ChoreInstances**
* NEVER generate rewards from:

  * templates
  * assignments
  * completed-but-not-approved tasks

### Reward Flow:

1. ChoreInstance → Completed
2. Adult approves → Approved
3. RewardLedger entry is created
4. AvatarProgress is updated

---

### 4.4 Household Isolation (Critical Security Rule)

Every entity MUST be scoped by HouseholdId where applicable.

* Users can ONLY access their own household data
* Queries MUST always filter by HouseholdId
* No cross-household joins or leaks allowed

---

## 5. Authentication & Authorization

ASP.NET Identity is used.

### Roles:

* Adult
* Child

### Rules:

* Adults:

  * full CRUD on tasks, assignments, approvals
  * can manage household

* Children:

  * can view assigned tasks
  * can mark tasks as completed
  * CANNOT approve tasks
  * CANNOT modify templates or assignments

Authorization must be enforced in the service layer AND via policy attributes where appropriate.

---

## 6. Service Layer Rules

All business logic MUST live in services.

### Required Services:

* UserService
* HouseholdService
* ChoreTemplateService
* ChoreAssignmentService
* ChoreInstanceService
* RewardService
* ProgressService

---

### Service Responsibilities

Each service must:

* Validate domain rules
* Enforce lifecycle constraints
* Ensure Household isolation
* Never bypass domain constraints

---

## 7. Entity Design Rules

### Required Pattern

* Entities represent pure domain state
* No business logic inside entities (no “smart entities”)

### Required Fields

All core entities MUST include:

* Id (Guid)
* HouseholdId (where applicable)
* CreatedAt / timestamps where relevant

---

## 8. Chore Instance Generation Rules

ChoreInstances MUST be created via one of:

### Option A: On-Demand Generation (MVP)

* Generated dynamically when requested

### Option B: Background Job (Preferred)

* Pre-generate 7–14 days ahead
* Ensures stable calendar UI performance

---

## 9. API Design Rules

### REST Principles MUST be followed

* GET = read only
* POST = create or action
* PUT/PATCH = updates
* DELETE = removal

---

### Response Rules

All API responses MUST:

* Use JSON
* Return consistent DTOs
* Never expose EF entities directly

---

## 10. DTO Rules

* DTOs are REQUIRED for all API responses
* DTOs must NOT contain EF navigation properties
* DTOs must be flat and API-focused

---

## 11. Reward System Rules

### RewardLedger is the source of truth

* Never compute balances from tasks
* Always compute balances from RewardLedger

### Balance Calculation:

Sum(RewardLedger.Amount where UserId == user)

---

## 12. Progress System Rules

AvatarProgress is independent from rewards.

* XP ≠ money
* Progress must not depend on RewardLedger
* Progress is updated ONLY on approved ChoreInstances

---

## 13. Logging & Observability

* Log all approvals and reward creations
* Log failed authorization attempts
* Log household boundary violations

---

## 14. Code Quality Standards

* Use async/await everywhere
* Use CancellationToken in service methods
* Follow SOLID principles
* Prefer explicit over implicit logic
* Keep methods small and single-purpose

---

## 15. Testing Expectations

For all services:

* Unit tests required for:

  * reward creation
  * approval flow
  * assignment logic
  * household isolation rules

---

## 16. Golden Rules (Non-Negotiable)

* ChoreInstance is the ONLY executable task entity
* Rewards ONLY happen after approval
* Household boundaries are NEVER violated
* Business logic NEVER lives in controllers
* Domain model MUST NOT be bypassed

---
