using API_Peppish.Entities;
using API_Peppish.Data;
using Microsoft.EntityFrameworkCore;

namespace API_Peppish.Repositories;

public interface IChoreInstanceRepository
{
    Task<ChoreInstance?> GetByIdAsync(Guid id, Guid householdId, CancellationToken cancellationToken = default);
    Task<List<ChoreInstance>> GetByDateRangeAsync(Guid householdId, DateTime from, DateTime to, CancellationToken cancellationToken = default);
    Task<List<ChoreInstance>> GetByAssignmentAsync(Guid assignmentId, Guid householdId, CancellationToken cancellationToken = default);
    Task<List<ChoreInstance>> GetByUserAndStatusAsync(string userId, Guid householdId, ChoreStatus status, CancellationToken cancellationToken = default);
    Task<ChoreInstance?> GetByAssignmentAndDateAsync(Guid assignmentId, DateTime dueDate, Guid householdId, CancellationToken cancellationToken = default);
    Task<ChoreInstance> CreateAsync(ChoreInstance instance, CancellationToken cancellationToken = default);
    Task UpdateAsync(ChoreInstance instance, CancellationToken cancellationToken = default);
    Task SaveChangesAsync(CancellationToken cancellationToken = default);
}

public class ChoreInstanceRepository(AppDbContext context) : IChoreInstanceRepository
{
    public async Task<ChoreInstance?> GetByIdAsync(Guid id, Guid householdId, CancellationToken cancellationToken = default)
    {
        return await context.ChoreInstances
            .FirstOrDefaultAsync(i => i.Id == id && i.HouseholdId == householdId, cancellationToken);
    }

    public async Task<List<ChoreInstance>> GetByDateRangeAsync(Guid householdId, DateTime from, DateTime to, CancellationToken cancellationToken = default)
    {
        return await context.ChoreInstances
            .Where(i => i.HouseholdId == householdId && i.DueDate >= from && i.DueDate <= to)
            .ToListAsync(cancellationToken);
    }

    public async Task<List<ChoreInstance>> GetByAssignmentAsync(Guid assignmentId, Guid householdId, CancellationToken cancellationToken = default)
    {
        return await context.ChoreInstances
            .Where(i => i.ChoreAssignmentId == assignmentId && i.HouseholdId == householdId)
            .ToListAsync(cancellationToken);
    }

    public async Task<List<ChoreInstance>> GetByUserAndStatusAsync(string userId, Guid householdId, ChoreStatus status, CancellationToken cancellationToken = default)
    {
        return await context.ChoreInstances
            .Where(i => i.HouseholdId == householdId && i.Status == status)
            .ToListAsync(cancellationToken);
    }

    public async Task<ChoreInstance?> GetByAssignmentAndDateAsync(Guid assignmentId, DateTime dueDate, Guid householdId, CancellationToken cancellationToken = default)
    {
        return await context.ChoreInstances
            .FirstOrDefaultAsync(i => i.ChoreAssignmentId == assignmentId && i.DueDate == dueDate && i.HouseholdId == householdId, cancellationToken);
    }

    public async Task<ChoreInstance> CreateAsync(ChoreInstance instance, CancellationToken cancellationToken = default)
    {
        await context.ChoreInstances.AddAsync(instance, cancellationToken);
        return instance;
    }

    public async Task UpdateAsync(ChoreInstance instance, CancellationToken cancellationToken = default)
    {
        context.ChoreInstances.Update(instance);
        await SaveChangesAsync(cancellationToken);
    }

    public async Task SaveChangesAsync(CancellationToken cancellationToken = default)
    {
        await context.SaveChangesAsync(cancellationToken);
    }
}
