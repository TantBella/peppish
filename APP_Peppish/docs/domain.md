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

## UI Status

- Pending
- Completed
- Approved

---

## Status Mapping (MANDATORY)

Must happen in hooks ONLY:
available / assigned → Pending
completed → Completed
approved → Approved

---

## Status Rules

- Pending = not started or assigned
- Completed = waiting for approval
- Approved = final state

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

Pending → Completed → Approved

No skipping allowed.