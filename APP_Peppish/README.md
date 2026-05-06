# Peppish – Family Chore & Reward Application

Peppish is a responsive web application designed to help families manage household chores in a structured and engaging way.
The app allows users (adults and children) to assign, track and complete chores such as cleaning, homework or routines like showering. Progress is visualized through rewards and playful mechanics (e.g. progress containers, avatars, piggy bank).

---

## Features

### User Roles

* **Adult**

  * Assign chores to children
  * Approve completed chores
  * Create and manage tasks

* **Child**

  * View and select chores
  * Create custom chores
  * Mark chores as completed (pending approval)

---

### Chore System

* Daily chores
* Weekly chores
* Irregular chores
* Self-assigned or assigned by others

---

### Rewards and Progress

* **Piggy Bank**: Earn money for completing rewarded chores
* **Progress Bottle**:

  * Fills as required chores are completed
  * When full, triggers avatar interaction

---

### Gamification

* Visual progress tracking
* Avatar-based feedback
* Reward reinforcement system

---

## Tech Stack

### Frontend

* React (Vite)
* TypeScript
* Tailwind CSS
* Zustand (state management)
* React Router
* Axios

### Optional Enhancements

* React Hook Form and Zod (forms and validation)
* Framer Motion (animations)

---

## Project Structure

```
/src
  /components     # Reusable UI components
  /features       # Feature-based modules (chores, auth, etc.)
  /pages          # Route-level components
  /hooks          # Custom hooks
  /services       # API communication layer
  /store          # Zustand stores
  /types          # TypeScript types
```

---

## API Integration

This frontend connects to an existing backend API.

### Requirements

* REST API
* JWT Authentication

### Example Endpoints

```
POST   /auth/login
POST   /auth/register
GET    /users/me

GET    /chores
POST   /chores
PATCH  /chores/:id
DELETE /chores/:id

POST   /chores/:id/complete
POST   /chores/:id/approve
```

---

## Getting Started

### 1. Clone the Repository

```
git clone https://github.com/TantBella/peppish.git
cd APP_Peppish
```

### 2. Install Dependencies

```
npm install
```

### 3. Setup Environment Variables

Create a `.env` file in the root:

```
VITE_API_URL=<your-backend-url>
```

### 4. Run Development Server

```
npm run dev
```

### 5. Build for Production

```
npm run build
```

---

## Vision

Peppish is a gamified household task app designed to help families manage daily responsibilities in a fun and motivating way.
