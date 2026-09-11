# Frontend Domain Model

## Core Principle

Frontend MUST reflect backend domain exactly.

Frontend does NOT define its own domain model.

---

## Primary Entity

### Chore (API)

Represents a task occurrence (Chore Instance).

This is the ONLY task entity used in UI.

---

## Critical Rule

Chore === ChoreInstanceDto

- Same concept
- No duplication
- No mapping between entities

---

## Status Model

API Status:

- available
- assigned
- completed
- approved

---

## Status Labels

- available → Tillgänglig
- assigned → Tilldelad
- completed → Klar
- approved → Godkänd

---

## Status Rules

- available = available but not assigned
- assigned = assigned to a user
- completed = waiting for adult approval
- approved = final state

---

## Business Rules

- Completed is NOT finished
- Rewards ONLY granted on Approved
- Approval requires adult role

---

## Forbidden

Frontend MUST NOT:

- Use ChoreTemplate
- Use ChoreAssignment
- Invent fields
- Invent transitions

---

## Transition Flow (STRICT)

available → assigned → completed → approved

The only additional allowed transition is `assigned → available` when an assignment is released.

No skipping allowed.
