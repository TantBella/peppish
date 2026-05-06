# Copilot Learnings
## Purpose

Project-specific conventions and mistakes to avoid.

## Do NOT
- Do not force language
- Do not rewrite working code without reason
- Do not duplicate documentation
- Do not guess
- Do not ignore patterns
- Do not delete docs

## General
- Do not overengineer
- Always follow DOMAIN.md
- Never mix Template / Assignment / Instance
- Always enforce HouseholdId filtering

## Testing Strategy
- Use xUnit + Moq
- Focus on business rules
- Test service layer
- Avoid mocking DbContext
- Keep tests simple

## Common Mistakes
- Creating rewards before approval
- Skipping service layer
- Exposing EF entities
- Mocking DbContext incorrectly
- Over-testing trivial logic

## Learnings
- Split large components early
- Prefer local state
- Define types BEFORE logic