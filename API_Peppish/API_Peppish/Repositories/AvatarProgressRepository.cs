using API_Peppish.Entities;
using API_Peppish.Data;
using Microsoft.EntityFrameworkCore;

namespace API_Peppish.Repositories;

public interface IAvatarProgressRepository
{
    Task<AvatarProgress?> GetByUserAsync(string userId, Guid householdId, CancellationToken cancellationToken = default);
    Task<AvatarProgress> CreateOrUpdateAsync(AvatarProgress progress, CancellationToken cancellationToken = default);
    Task SaveChangesAsync(CancellationToken cancellationToken = default);
}

public class AvatarProgressRepository(AppDbContext context) : IAvatarProgressRepository
{
    public async Task<AvatarProgress?> GetByUserAsync(string userId, Guid householdId, CancellationToken cancellationToken = default)
    {
        return await context.AvatarProgresses
            .FirstOrDefaultAsync(p => p.UserId == userId && p.HouseholdId == householdId, cancellationToken);
    }

    public async Task<AvatarProgress> CreateOrUpdateAsync(AvatarProgress progress, CancellationToken cancellationToken = default)
    {
        var existing = await GetByUserAsync(progress.UserId, progress.HouseholdId, cancellationToken);
        if (existing == null)
        {
            await context.AvatarProgresses.AddAsync(progress, cancellationToken);
            return progress;
        }

        existing.CurrentLevel = progress.CurrentLevel;
        existing.CurrentXp = progress.CurrentXp;
        existing.DailyProgressPercent = progress.DailyProgressPercent;
        existing.UpdatedAt = DateTime.UtcNow;
        context.AvatarProgresses.Update(existing);
        return existing;
    }

    public async Task SaveChangesAsync(CancellationToken cancellationToken = default)
    {
        await context.SaveChangesAsync(cancellationToken);
    }
}
