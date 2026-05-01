# Family Task API

## Overview

This is the backend API for a family task and reward system designed to help households manage chores, responsibilities, and motivation for both adults and children.

The system supports:

* Household-based task management
* Role-based access (Adult / Child)
* Task scheduling and recurring chores
* Approval-based completion flow
* Reward and progression system

---

## Tech Stack

* .NET 8 Web API
* Entity Framework Core
* SQL Server
* ASP.NET Identity
* REST API architecture

---

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/TantBella/peppish.git
cd api
```

---

### 2. Configure environment variables

Create an `appsettings.Development.json` file:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=...;Database=...;Trusted_Connection=True;"
  },
  "Jwt": {
    "Key": "your-secret-key"
  }
}
```

---

### 3. Run database migrations

```bash
dotnet ef database update
```

---

### 4. Start the API

```bash
dotnet run
```

API will be available at:

```
https://localhost:5001
http://localhost:5000
```

Swagger:

```
https://localhost:5001/swagger
```

---

## Authentication

The system uses ASP.NET Identity with JWT authentication.

### Roles:

* `Adult`
* `Child`

All endpoints (except auth) require authentication via Bearer token:

```
Authorization: Bearer <token>
```

---

## Key Concepts (High Level)

* Household: isolates all user data
* ChoreTemplate: defines a task
* ChoreAssignment: assigns task to user
* ChoreInstance: actual scheduled task
* RewardLedger: tracks earned rewards
* AvatarProgress: gamification system

---

## Database

* Uses SQL Server
* Managed via Entity Framework Core migrations
* All data is scoped by HouseholdId for isolation

---

## Folder Structure

```
/Controllers   → API endpoints
/Services      → Business logic
/Repositories  → Data access
/Models        → Domain entities
/DTOs          → API contracts
/Data          → DbContext + migrations
```

---

## Notes

* Business logic is handled in service layer only
* Controllers are thin and only handle HTTP requests
* Rewards are only created after task approval
* All operations are scoped to a household

---
