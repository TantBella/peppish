# Tasks:

## Phase 1 – Setup

- [x] Create React app
- [x] Setup routing
- [x] Setup persistence layer abstraction
- [x] Setup LocalStorage persistence
- [x] Update Architecture

### Phase 1.5 - Domain & Data model

- [ ] Define domain models (TypeScript interfaces/types)
- [ ] Implement chore state machine (enum + transitions)
- [ ] Implement reward rules (XP + money logic)
- [ ] Implement daily chore grouping logic
- [ ] Implement mock data factory (seed data)
- [ ] Central state store

## Phase 2 – Auth

- [x] Login page
- [x] Store JWT
- [x] Protect routes

### Phase 2.5 – Core Services

- [ ] ChoreService (create, assign, complete, approve)
- [ ] RewardService (XP + money calculation)
- [ ] HouseholdService
- [ ] ProgressService (daily bar logic)

## Phase 3 – Chores

- [x] Chore list (week view)
- [x] Complete chore action
- [x] Approve chore (adult)

### Phase 3.5 – UI states

- [ ] Loading states (simulated API calls)
- [ ] Empty states (no chores, no users)
- [ ] Error states (invalid approval, etc.)
- [ ] Optimistic updates (optional but useful)

## Phase 4 – Rewards

- [x] Show balance
- [x] Show reward history
- [ ] Wallet (money ledger, not just “balance”)
- [ ] XP ledger (daily history)
- [ ] Reward events (log: “chore approved → +10 kr”)

## Phase 5 – Progress

- [x] Show avatar progress
- [x] Show daily progress bar
- [ ] Daily chore aggregation engine
- [ ] Reset logic (midnight / new day)
- [ ] Completion ratio calculation per user

## Phase 6 – Testing

- [ ] API client & interceptor tests
- [ ] Auth context & hooks tests
- [ ] Component unit tests
- [ ] Integration tests
- [ ] Error handling tests

<!-- ## Phase 7 - Future stuff -->
<!-- - [ ] Setup API integration -->
