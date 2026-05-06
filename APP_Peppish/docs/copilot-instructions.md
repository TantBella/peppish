# Copilot Instructions – Frontend (React + TypeScript)

## 1. Purpose of This File

This file defines strict implementation rules for the frontend application.

It MUST be treated as the highest authority for frontend code generation, second only to DOMAIN.md.

If there is any conflict:

1. DOMAIN.md (business rules)
2. COPILOT-INSTRUCTIONS.md (frontend rules)
3. API-SPEC.md (backend contract)

---

## Learning Integration (MANDATORY)

The AI must ALWAYS:

1. Read /docs/copilot-learnings.md before starting any task
2. Apply relevant learnings when planning and coding
3. Avoid repeating previously identified mistakes
4. Follow DOMAIN.md strictly
5. Follow API-SPEC.md exactly (no assumptions)
6. Never invent API fields or behavior
7. Keep UI consistent with backend state

If a learning is relevant, the AI should explicitly acknowledge it.

---

## 2. Tech Stack (Mandatory)

- React
- TypeScript
- Tailwind
- Vite (or Next.js if explicitly chosen)
- React Query
- Fetch or Axios (via service layer)

---

## 3. Project Structure (MANDATORY)

/src
  /components
  /pages
  /services
  /hooks
  /types
  /utils (optional)

---

### Rules

- DO NOT create new folders
- DO NOT mix responsibilities
- One component per file
- Components >200 lines MUST be split
- Hooks should stay under ~150 lines

---

## 4. Architecture Rules

### Data Flow

Component → Hook → Service → API

---

### Responsibilities

Components:
- UI only
- No API calls
- No business logic

Hooks:
- State + side effects
- Use React Query
- Transform data
- Handle ALL mapping

Services:
- API only
- Return raw data
- No transformations

---

## 5. React Query Rules

Correct:

['chores', { status, assignedTo }]

Wrong:

['chores']
['chores', status]

---

## 6. API Rules

- NEVER call API in components
- ALWAYS use services
- ALWAYS type responses
- NEVER hardcode data

---

## API Client

/services/apiClient.ts

Must:
- Handle base URL
- Attach token
- Handle errors

---
### Environment Rules (STRICT)

- Base URL MUST come from VITE_API_URL
- NEVER hardcode localhost or any URL in services
- Code must work for dev, staging, and production without changes
---
## Golden Example

```ts
export const choreService = {
  getChores: (params) =>
    apiClient.get<Chore[]>('/chore-instances', { params })
}

export const useChores = (filters) =>
  useQuery({
    queryKey: ['chores', filters],
    queryFn: () => choreService.getChores(filters)
  })
  ```
 ## 7. Domain Rules
- Chore from API is the ONLY entity
- Chore === ChoreInstanceDto

### Status Mapping

available / assigned → Pending
completed → Completed
approved → Approved

MUST happen in hooks only

## 8. State
- Server state → React Query
- UI state → useState
- No duplication

## 9. Types
- No any
- Must match API

## 10. Auth
- Use React Context + useAuth
- Auto attach token
- Logout on 401

## 11. Routing
- Use React Router
- Use AuthGuard

## 12. UX
- Clear states
- Immediate feedback
- Never hide actions

## 13. Performance

Optimize only when needed

## 14. Uncertainty Rule

If unclear:

STOP
Add TODO
Do NOT guess

## 15. Definition of Done

All must be true:

- Correct structure
- Correct types
- Correct data flow
- React Query used properly
- Errors handled
- No any
- No API in components
- UI matches backend
- Code compiles