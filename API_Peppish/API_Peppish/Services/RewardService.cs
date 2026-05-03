using API_Peppish.Repositories;
using API_Peppish.DTOs;

namespace API_Peppish.Services;

public interface IRewardService
{
    Task<decimal> GetUserBalanceAsync(string userId, CancellationToken cancellationToken = default);
    Task<List<RewardDto>> GetUserRewardsAsync(string userId, CancellationToken cancellationToken = default);
}

public class RewardService(
    IRewardRepository repository,
    IUserContextService userContextService) : IRewardService
{
    public async Task<decimal> GetUserBalanceAsync(string userId, CancellationToken cancellationToken = default)
    {
        var householdId = userContextService.GetCurrentHouseholdId();
        return await repository.GetUserBalanceAsync(userId, householdId, cancellationToken);
    }

    public async Task<List<RewardDto>> GetUserRewardsAsync(string userId, CancellationToken cancellationToken = default)
    {
        var householdId = userContextService.GetCurrentHouseholdId();
        var rewards = await repository.GetByUserAsync(userId, householdId, cancellationToken);
        return rewards.Select(r => new RewardDto { Amount = r.Amount, Reason = r.Reason, CreatedAt = r.CreatedAt }).ToList();
    }
}
