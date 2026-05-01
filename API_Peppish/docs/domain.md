# Domain Model – Family Task & Reward System

## 1. Purpose

The system is designed to help families and households organize daily life by combining:

* Task planning
* Responsibility distribution
* Motivation through rewards and progression

A **Household** acts as the primary unit, containing multiple users with different roles and permissions.

---

## 2. Core Concepts

### Household

A household represents a family or group of users.

* A household contains multiple users
* All data is scoped to a household
* Users cannot access data from other households

---

### User

Represents a person in a household.

#### Properties

* Id (Guid)
* Name (string)
* Role (enum: Adult, Child)
* HouseholdId (Guid)

#### Rules

* Every user belongs to exactly one household
* Adults have full permissions within the household
* Children have restricted permissions and require approval for completed tasks

---

## 3. Task System (Chores)

The task system is divided into three layers to support flexibility, scheduling, and history.

---

### 3.1 ChoreTemplate (Definition)

Defines what a task is.

#### Properties

* Id (Guid)
* HouseholdId (Guid)
* Title (string)
* Description (string)
* RewardAmount (decimal) — monetary reward
* RewardPoints (int) — optional gamification points
* Recurrence (enum: None, Daily, Weekly)
* CreatedByUserId (Guid)

#### Rules

* Templates are reusable across time
* Templates do NOT represent actual scheduled work

---

### 3.2 ChoreAssignment (Responsibility)

Defines who is responsible for a task.

#### Properties

* Id (Guid)
* ChoreTemplateId (Guid)
* AssignedToUserId (Guid)
* AssignedByUserId (Guid)
* StartDate (DateTime)

#### Rules

* A template can have multiple assignments
* Assignments define responsibility, not execution
* Assignments are used to generate actual task instances

---

### 3.3 ChoreInstance (Execution)

Represents a specific occurrence of a task at a given time.

#### Properties

* Id (Guid)
* ChoreAssignmentId (Guid)
* DueDate (DateTime)
* Status (enum: Pending, Completed, Approved)
* CompletedAt (DateTime, nullable)
* ApprovedAt (DateTime, nullable)
* ApprovedByUserId (Guid, nullable)

#### Rules

* Instances are generated from assignments
* Instances are what the UI displays (calendar/week view)
* History is stored at the instance level

---

### Chore Status Transitions (STRICT)

Allowed transitions:

* Pending → Completed
* Completed → Approved

Forbidden transitions:

* Pending → Approved
* Approved → Completed
* Completed → Pending

#### Rules

* A chore MUST be Completed before it can be Approved
* Approved chores are final and cannot be modified

---

## 4. Task Lifecycle

### Standard Flow

1. A **ChoreTemplate** is created
2. A **ChoreAssignment** assigns it to a user
3. One or more **ChoreInstances** are generated over time

---

### Completion Flow

#### For Children

1. Child marks task as completed
   → Status = `Completed`

2. Task must be approved by an adult
   → Status = `Approved`

3. After approval:

   * Reward is granted
   * Progress is updated

#### For Adults

* Adults may complete tasks directly
* Approval step may be skipped depending on business rules

---

## 5. Rewards System

Rewards are **decoupled** from tasks to allow flexibility.

---

### RewardLedger

Tracks all rewards (money or points).

#### Properties

* Id (Guid)
* UserId (Guid)
* Amount (decimal)
* Reason (string)
* CreatedAt (DateTime)

#### Rules

* A ledger entry is created ONLY when a task is approved
* Each ChoreInstance can generate at most ONE RewardLedger entry
* The ledger acts as the source of truth for balances
* Rewards should never be calculated directly from tasks

---

### Balance

A user’s balance is calculated as:

```
Sum of all RewardLedger.Amount for that user
```

---

## 6. Gamification / Progression

Optional but central for child motivation.

---

### AvatarProgress

Tracks user progression and visual feedback.

#### Properties

* UserId (Guid)
* CurrentLevel (int)
* CurrentXp (int)
* DailyProgressPercent (int: 0–100)

#### Rules

* Progress increases when tasks are approved
* DailyProgressPercent reflects completion of assigned tasks for the day
* DailyProgressPercent must be recalculated, not incremented blindly
* Progress logic must be independent from reward logic

---

## 7. Scheduling

The system must generate ChoreInstances from assignments.

---

### Strategy Options

#### Option A: On-Demand (MVP)

* Instances are generated when requested by the API
* No persistence required for future instances

#### Option B: Background Job (Recommended)

* A scheduled job generates upcoming instances (e.g., 7 days ahead)
* Improves performance and consistency

---

### Instance Generation Rules

* Instances must NOT be duplicated for the same date

* Each (Assignment, DueDate) combination must be unique

* For Daily recurrence:
  → create one instance per day

* For Weekly recurrence:
  → create one instance per week on the same weekday as StartDate

* Instances must not be generated before Assignment.StartDate

---

## 8. Permissions & Authorization

### Adults

* Full control over:

  * Tasks
  * Assignments
  * Approvals
  * Household management

### Children

* Can:

  * View assigned tasks
  * Mark tasks as completed

* Cannot:

  * Approve tasks
  * Modify assignments or templates

---

## 9. Data Integrity Rules

* All entities must include HouseholdId where applicable
* Cross-household access is strictly forbidden
* Reward creation must only happen after approval
* ChoreInstances must always reference a valid assignment
* Deleting templates must not break historical instances

---

### Household Consistency

All related entities MUST belong to the same Household.

Examples:

* ChoreAssignment.HouseholdId must match:

  * ChoreTemplate.HouseholdId
  * AssignedToUser.HouseholdId

* ChoreInstance must inherit HouseholdId from ChoreAssignment

Violations must result in errors.

---

### Deletion Rules

* Deleting a ChoreAssignment must NOT delete historical ChoreInstances
* Deleting a User must be restricted if related data exists

---

## 10. Design Principles

* Separate definition, assignment, and execution
* Keep rewards independent from task logic
* Store history explicitly (do not derive it dynamically)
* Prefer explicit state transitions over implicit logic
* Ensure all business rules are enforced in the service layer (not controllers)

---

## 11. Enums

### UserRole

* Adult
* Child

---

### ChoreStatus

* Pending
* Completed
* Approved

---

### RecurrenceType

* None
* Daily
* Weekly

---
