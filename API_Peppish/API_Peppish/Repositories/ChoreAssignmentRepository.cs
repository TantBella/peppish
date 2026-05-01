using API_Peppish.Entities;
using API_Peppish.Data;
using Microsoft.EntityFrameworkCore;

namespace API_Peppish.Repositories;

public interface IChoreAssignmentRepository
{
    Task<ChoreAssignment?> GetByIdAsync(Guid id, Guid householdId, CancellationToken cancellationToken = default);
    Task<List<ChoreAssignment>> GetByUserAsync(string userId, Guid householdId, CancellationToken cancellationToken = default);
    Task<List<ChoreAssignment>> GetByTemplateAsync(Guid templateId, Guid householdId, CancellationToken cancellationToken = default);
    Task<ChoreAssignment> CreateAsync(ChoreAssignment assignment, CancellationToken cancellationToken = default);
    Task SaveChangesAsync(CancellationToken cancellationToken = default);
}

public class ChoreAssignmentRepository(AppDbContext context) : IChoreAssignmentRepository
{
    public async Task<ChoreAssignment?> GetByIdAsync(Guid id, Guid householdId, CancellationToken cancellationToken = default)
    {
        return await context.ChoreAssignments
            .FirstOrDefaultAsync(a => a.Id == id && a.HouseholdId == householdId, cancellationToken);
    }

    public async Task<List<ChoreAssignment>> GetByUserAsync(string userId, Guid householdId, CancellationToken cancellationToken = default)
    {
        return await context.ChoreAssignments
            .Where(a => a.AssignedToUserId == userId && a.HouseholdId == householdId)
            .ToListAsync(cancellationToken);
    }

    public async Task<List<ChoreAssignment>> GetByTemplateAsync(Guid templateId, Guid householdId, CancellationToken cancellationToken = default)
    {
        return await context.ChoreAssignments
            .Where(a => a.ChoreTemplateId == templateId && a.HouseholdId == householdId)
            .ToListAsync(cancellationToken);
    }

    public async Task<ChoreAssignment> CreateAsync(ChoreAssignment assignment, CancellationToken cancellationToken = default)
    {
        await context.ChoreAssignments.AddAsync(assignment, cancellationToken);
        return assignment;
    }

    public async Task SaveChangesAsync(CancellationToken cancellationToken = default)
    {
        await context.SaveChangesAsync(cancellationToken);
    }
}
