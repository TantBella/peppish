# API Specification – Family Task System

## Base URL

```
/api
```

All endpoints require authentication unless stated otherwise.

---

## Authentication

### Register

```
POST /auth/register
```

**Request**

```json id="auth1"
{
  "name": "string",
  "email": "string",
  "password": "string",
  "householdName": "string"
}
```

**Response**

```json id="auth2"
{
  "userId": "guid",
  "token": "jwt"
}
```

---

### Login

```
POST /auth/login
```

**Request**

```json id="auth3"
{
  "email": "string",
  "password": "string"
}
```

**Response**

```json id="auth4"
{
  "token": "jwt"
}
```

---

## Users

### Get Current User

```
GET /users/me
```

**Response**

```json id="user1"
{
  "id": "guid",
  "name": "string",
  "role": "Adult | Child",
  "householdId": "guid"
}
```

---

## Households

### Get Household

```
GET /households/{id}
```

**Response**

```json id="hh1"
{
  "id": "guid",
  "name": "string",
  "users": [
    {
      "id": "guid",
      "name": "string",
      "role": "Adult | Child"
    }
  ]
}
```

---

## Chore Templates (Definition Layer)

### Create Template

```
POST /chore-templates
```

**Request**

```json id="ct1"
{
  "title": "string",
  "description": "string",
  "rewardAmount": 10,
  "rewardPoints": 100,
  "recurrence": "None | Daily | Weekly"
}
```

**Response**

```json id="ct2"
{
  "id": "guid",
  "title": "string"
}
```

---

### Get Templates

```
GET /chore-templates
```

---

## Chore Assignments (Responsibility Layer)

### Assign Chore

```
POST /chore-assignments
```

**Request**

```json id="ca1"
{
  "choreTemplateId": "guid",
  "assignedToUserId": "guid",
  "startDate": "2026-04-30"
}
```

---

### Get User Assignments

```
GET /users/{userId}/assignments
```

---

## Chore Instances (Execution Layer)

### Get Chores (Calendar View)

```
GET /chores?from=2026-04-01&to=2026-04-07
```

**Response**

```json id="ci1"
[
  {
    "id": "guid",
    "title": "Städa rummet",
    "dueDate": "2026-04-30",
    "status": "Pending | Completed | Approved",
    "assignedToUserId": "guid",
    "rewardAmount": 10
  }
]
```

---

### Complete Chore

```
POST /chores/{id}/complete
```

**Rules**

* Allowed for assigned user only
* Children require approval afterwards

**Response**

```json id="ci2"
{
  "id": "guid",
  "status": "Completed"
}
```

---

### Approve Chore

```
POST /chores/{id}/approve
```

**Rules**

* Only Adults can approve
* Triggers reward creation

**Response**

```json id="ci3"
{
  "id": "guid",
  "status": "Approved"
}
```

---

## Rewards

### Get User Rewards

```
GET /users/{userId}/rewards
```

**Response**

```json id="rw1"
[
  {
    "amount": 10,
    "reason": "Completed chore",
    "createdAt": "2026-04-30"
  }
]
```

---

### Get Balance

```
GET /users/{userId}/balance
```

**Response**

```json id="rw2"
{
  "balance": 120
}
```

---

## Progress (Gamification)

### Get Progress

```
GET /users/{userId}/progress
```

**Response**

```json id="pg1"
{
  "currentLevel": 3,
  "currentXp": 240,
  "dailyProgressPercent": 70
}
```

---

## System Rules (IMPORTANT)

### Task Lifecycle

```
ChoreTemplate → ChoreAssignment → ChoreInstance
```

Only **ChoreInstance** can:

* be completed
* be approved
* generate rewards

---

### Reward Rules

* Rewards are created ONLY after approval
* Rewards are stored in RewardLedger
* Balance is always calculated from ledger

---

### Authorization Rules

* Adults: full access
* Children: can complete but not approve tasks
* All data is scoped by HouseholdId

---

## Error Format (Standard)

```json id="err1"
{
  "error": "string",
  "code": "string"
}
```

---

## Notes

* All endpoints return JSON
* All dates are ISO 8601
* All APIs are versioned internally (v1 assumed)
* Household isolation is enforced server-side

---
