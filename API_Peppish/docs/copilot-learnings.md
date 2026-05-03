# Copilot Learnings

## General

- Do not overengineer solutions
- Always follow domain.md strictly
- Never mix Template, Assignment, Instance
- Always enforce HouseholdId filtering

## Testing Strategy

- Use xUnit + Moq for unit testing
- Focus on critical business rules: reward creation, approval flow, household isolation
- Test the service layer, not EF queries directly
- Use InMemoryDatabase sparingly - mock repositories instead for unit tests
- Keep tests focused and simple; avoid complex EF mock setups

## Common Mistakes

- Creating rewards before approval 
- Skipping service layer 
- Exposing EF entities
- Trying to mock DbContext directly - use InMemoryDatabase or mock repositories
- Over-testing trivial logic; focus on business rules that could break