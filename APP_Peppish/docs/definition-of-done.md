# Definition of Done (DoD) – Peppish Phases 1.5–5

---

## Phase 1.5 – Domain & Data Model (DoD)

This phase is complete when:

### Domain Modeling

- All core domain types are defined and consistently used:
  - Household
  - User (adult/child)
  - Chore
  - Assignment
  - Completion
  - Approval
  - Reward
  - DailyChoreGroup (or equivalent)

### State Machine

- Chores only transition through valid states
- Invalid transitions are prevented at code level (not only in UI)

Example constraints:

- A chore cannot be approved unless it is completed
- A chore cannot be completed unless it is assigned or available

### Reward Rules

- XP and money logic is implemented as pure deterministic functions
- Same input always produces the same output

### Daily Grouping Logic

- Chores can be grouped per user per day without UI dependency

### Seed Data

- Application can initialize a fully working household from mock data

### State Store

- A central state management solution exists and is consistently used
- No scattered ad-hoc state logic across components

---

## Phase 2.5 – Core Services (DoD)

This phase is complete when:

### Service Layer Exists

All business logic is moved out of UI into services:

- ChoreService
- RewardService
- HouseholdService
- ProgressService

### UI is Dumb

- UI only calls services
- UI contains no business logic

### End-to-End Flow Works via Services

The full lifecycle can be executed without UI:

- Create chore
- Assign chore
- Complete chore
- Approve chore
- Trigger reward calculation

### Persistence Abstraction

- Services are independent of LocalStorage or any persistence implementation

---

## Phase 3.5 – UI States (DoD)

This phase is complete when:

### Loading States

- All async flows include loading states (even simulated ones)

### Empty States

- Empty household state is handled correctly
- Empty chore lists render correctly

### Error States

- Invalid actions are handled gracefully (no crashes)
- Examples: double approval, invalid role actions

### Optimistic Updates

- UI updates immediately on action
- Rollback or reconciliation strategy exists in case of failure

---

## Phase 4 – Rewards System (DoD)

This phase is complete when:

### Wallet (Money Ledger)

- Money is stored as a transaction ledger
- Balance is derived, not manually stored

### XP Ledger

- XP is tracked per day
- XP origin is traceable (which chore or event generated it)

### Reward Events

All reward actions are recorded as events:

- chore approved → +money
- daily completion → +XP

### Consistency

- Reward calculations are deterministic
- No double payouts are possible

---

## Phase 5 – Progress System (DoD)

This phase is complete when:

### Daily Aggregation Engine

- System can compute daily progress without UI dependency

### XP Meter is Data Driven

- Progress is based on calculation:
  - completed chores / total chores

### Reset Logic

- New day resets progress correctly
- Previous day data does not affect current day

### Edge Case Handling

- Zero chores in a day is handled explicitly (no NaN / crashes)
- Late-added chores update progress correctly

---

## Go / No-Go Rule

You may only proceed beyond Phase 5 when:

- The entire system can run without UI interaction
- Full lifecycle simulation works in code:
  create → complete → approve → reward → progress
- No feature requires manual state patching to function correctly
