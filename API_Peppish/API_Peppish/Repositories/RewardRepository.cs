using API_Peppish.Entities;
using API_Peppish.Data;
using Microsoft.EntityFrameworkCore;

namespace API_Peppish.Repositories;

public interface IRewardRepository
{
    Task<RewardLedger?> GetByIdAsync(Guid id, Guid householdId, CancellationToken cancellationToken = default);
    Task<List<RewardLedger>> GetByUserAsync(string userId, Guid householdId, CancellationToken cancellationToken = default);
    Task<decimal> GetUserBalanceAsync(string userId, Guid householdId, CancellationToken cancellationToken = default);
    Task<RewardLedger> CreateAsync(RewardLedger reward, CancellationToken cancellationToken = default);
    Task SaveChangesAsync(CancellationToken cancellationToken = default);
}

public class RewardRepository(AppDbContext context) : IRewardRepository
{
    public async Task<RewardLedger?> GetByIdAsync(Guid id, Guid householdId, CancellationToken cancellationToken = default)
    {
        return await context.RewardLedgers
            .FirstOrDefaultAsync(r => r.Id == id && r.HouseholdId == householdId, cancellationToken);
    }

    public async Task<List<RewardLedger>> GetByUserAsync(string userId, Guid householdId, CancellationToken cancellationToken = default)
    {
        return await context.RewardLedgers
            .Where(r => r.UserId == userId && r.HouseholdId == householdId)
            .ToListAsync(cancellationToken);
    }

    public async Task<decimal> GetUserBalanceAsync(string userId, Guid householdId, CancellationToken cancellationToken = default)
    {
        return await context.RewardLedgers
            .Where(r => r.UserId == userId && r.HouseholdId == householdId)
            .SumAsync(r => r.Amount, cancellationToken);
    }

    public async Task<RewardLedger> CreateAsync(RewardLedger reward, CancellationToken cancellationToken = default)
    {
        await context.RewardLedgers.AddAsync(reward, cancellationToken);
        return reward;
    }

    public async Task SaveChangesAsync(CancellationToken cancellationToken = default)
    {
        await context.SaveChangesAsync(cancellationToken);
    }
}
