# Peppish

Peppish is a gamified household task app designed to help families manage daily responsibilities in a fun and motivating way.

The app allows users (adults and children) to assign, track and complete chores such as cleaning, homework or routines like showering. Progress is visualized through rewards and playful mechanics (e.g. progress containers, avatars, piggy bank).

## Project Structure
/api_peppish     → .NET Web API (backend)  

/app_peppish     → React application (frontend)

## Tech Stack

### Backend
.NET Web API

ASP.NET Core Identity

Entity Framework Core

PostgreSQL / SQL Server

### Frontend
React

TypeScript

## Features (MVP)
- User accounts (Adult / Child roles)

- Household grouping

- Create and assign chores

- View chores by day/week

- Mark chores as completed

- Basic progress tracking

## Getting Started

### Backend
```
cd api_peppish

dotnet restore

dotnet ef database update

dotnet run 
```

### Frontend
```
cd app_peppish

npm install

npm start
```

## Development Principles
- Controllers must not contain business logic
- All domain rules must be implemented in services
- Separate chore templates from chore instances
- Keep backend as the single source of truth

### Notes

This project focuses on:
- clear domain modeling
- scalable architecture
- incremental feature development

> ## Status
> Early development (MVP phase) 
>
> ### Future features include:
> - gamification (avatars, rewards, streaks)
> - notifications
> - leaderboard / family stats
> - connecting with other households/friend