using API_Peppish.DTOs;
using API_Peppish.Entities;
using API_Peppish.Repositories;

namespace API_Peppish.Services;

public interface IRewardService
{
    Task<UserBalanceResult> GetUserBalanceAsync(string userId, CancellationToken cancellationToken = default);

    Task<List<RewardDto>> GetUserRewardsAsync(string userId, CancellationToken cancellationToken = default);
}

public class RewardService(
    IRewardRepository repository,
    IUserContextService userContextService) : IRewardService
{
    public async Task<UserBalanceResult> GetUserBalanceAsync(string userId, CancellationToken cancellationToken = default)
    {
        var householdId = userContextService.GetCurrentHouseholdId();

        var balance = await repository.GetUserBalanceAsync(userId, householdId, cancellationToken);

        return new UserBalanceResult
        {
            MoneyBalance = balance.MoneyBalance,
            TotalXp = balance.TotalXp
   
        };
    }

    public Task<UserBalanceResult> GetUserBalanceAsync(string userId, Guid householdId, CancellationToken cancellationToken = default)
    {
        throw new NotImplementedException();
    }

    public async Task<List<RewardDto>> GetUserRewardsAsync(string userId, CancellationToken cancellationToken = default)
    {
        var householdId = userContextService.GetCurrentHouseholdId();

        var rewards = await repository.GetByUserAsync(userId, householdId, cancellationToken);

        return rewards.Select(r => new RewardDto
        {
            MoneyAmount = r.MoneyAmount,
            XpAmount = r.XpAmount,
            Reason = r.Reason,
            CreatedAt = r.CreatedAt
        }).ToList();
    }
}