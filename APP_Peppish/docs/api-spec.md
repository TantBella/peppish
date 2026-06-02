# API Specification (Future Backend Contract)

IMPORTANT:

The application currently uses LocalStorage as the active persistence layer.

This API specification represents the FUTURE backend contract and must still define:

- shared types
- domain behavior
- future API structure

Frontend architecture MUST still follow:

Component → Hook → Service

However, services currently use LocalStorage internally instead of HTTP requests.

The service layer MUST be designed so LocalStorage can later be replaced with API calls without changing hooks or components.

This document defines how the frontend interacts with the backend API.
All code must strictly follow this specification. No assumptions allowed.

---

## 0. Critical Concept Clarification (MANDATORY)

The API returns `Chore`.

Frontend MUST treat:

Chore === ChoreInstanceDto

They represent the SAME concept.

- DO NOT create separate types
- DO NOT map between them
- DO NOT rename them internally

---

## 1. Base Configuration

- Base URL: REACT_APP_API_URL
- Content-Type: application/json
- Authentication: Bearer Token (JWT)

### Development (example)

REACT_APP_API_URL=http://localhost:3000

### Rules

- NEVER hardcode URLs in code
- ALWAYS use REACT_APP_API_URL
- Environment variables MUST control all environments

### Headers

Authorization: Bearer <token>

---

## 2. Shared Types

```ts
export type Role = "adult" | "child";

export type ChoreType = "daily" | "weekly" | "irregular";

export type ChoreStatus = "available" | "assigned" | "completed" | "approved";

export type RewardType = "money" | "progress";

export interface User {
  id: string;
  name: string;
  role: Role;
}

export interface Chore {
  id: string;
  title: string;
  description?: string;
  type: ChoreType;
  status: ChoreStatus;
  rewardType: RewardType;
  rewardValue?: number;
  assignedTo?: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}
```

## 3. Status Mapping (Frontend Responsibility)

Frontend MUST map API status to UI status.

Mapping MUST happen in hooks ONLY.

```
available / assigned → Pending
completed → Completed
approved → Approved
```

- NEVER map in components
- NEVER invent new statuses

## 4. Endpoints

Auth
POST /auth/login

---

Request:

```
{
  "email": "string",
  "password": "string"
}
```

Response:

```
{
  token: string
  user: User
}
```

---

POST /auth/register

Request:

```
{
  "name": "string",
  "email": "string",
  "password": "string",
  "role": "adult" | "child"
}
```

Response:

```
{
  token: string
  user: User
}
```

---

### User

GET /users/me

Response:

## User

Chores
GET /chore-instances

Query params (optional):

- status?: ChoreStatus
- assignedTo?: string

Response:

## Chore[]

POST /chores

Request:

```
{
  title: string
  description?: string
  type: ChoreType
  rewardType: RewardType
  rewardValue?: number
  assignedTo?: string
}
```

Response:

## Chore

PATCH /chores/:id

Request:

Partial<Chore>

Response:

## Chore

DELETE /chores/:id

Response:

```
{
  success: boolean
}
```

---

## 5. Action Endpoints (Business Logic)

## These endpoints enforce domain behavior and MUST be used.

POST /chores/:id/complete

- Only assigned user can complete
- Status becomes completed
- NO reward yet

Response:

## Chore

POST /chores/:id/approve
Only adult can approve
Must be completed
Reward applied here

Response:

## Chore

## 6. Error Handling

```
export interface ApiError {
  message: string
  code: string
  status: number
}
```

Example:

```
{
  "message": "Unauthorized",
  "code": "AUTH_001",
  "status": 401
}
```

---

## 7. Implementation Rules

- No API calls in components
- Always use service layer
- All responses must be typed
- Never assume missing fields
- Handle loading + error states
- Do not bypass action endpoints
