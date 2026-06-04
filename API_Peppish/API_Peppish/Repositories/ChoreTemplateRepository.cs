using API_Peppish.Entities;
using API_Peppish.Data;
using Microsoft.EntityFrameworkCore;

namespace API_Peppish.Repositories;

public interface IChoreTemplateRepository
{
    Task<ChoreTemplate?> GetByIdAsync(Guid id, Guid householdId, CancellationToken cancellationToken = default);
    Task<List<ChoreTemplate>> GetByHouseholdAsync(Guid householdId, CancellationToken cancellationToken = default);
    Task<ChoreTemplate> CreateAsync(ChoreTemplate template, CancellationToken cancellationToken = default);
    Task UpdateAsync(ChoreTemplate template, CancellationToken cancellationToken = default);
    Task SaveChangesAsync(CancellationToken cancellationToken = default);
}

public class ChoreTemplateRepository(AppDbContext context) : IChoreTemplateRepository
{
    public async Task<ChoreTemplate?> GetByIdAsync(Guid id, Guid householdId, CancellationToken cancellationToken = default)
    {
        return await context.ChoreTemplates
            .FirstOrDefaultAsync(t => t.Id == id && t.HouseholdId == householdId, cancellationToken);
    }

    public async Task<List<ChoreTemplate>> GetByHouseholdAsync(Guid householdId, CancellationToken cancellationToken = default)
    {
        return await context.ChoreTemplates
            .Where(t => t.HouseholdId == householdId)
            .ToListAsync(cancellationToken);
    }

    public async Task<ChoreTemplate> CreateAsync(ChoreTemplate template, CancellationToken cancellationToken = default)
    {
        await context.ChoreTemplates.AddAsync(template, cancellationToken);
        return template;
    }

    public async Task SaveChangesAsync(CancellationToken cancellationToken = default)
    {
        await context.SaveChangesAsync(cancellationToken);
    }


    public async Task UpdateAsync(ChoreTemplate template, CancellationToken cancellationToken = default)
    {
        context.ChoreTemplates.Update(template);
    }
}
