using API_Peppish.Repositories;
using API_Peppish.DTOs;

namespace API_Peppish.Services;

public interface IProgressService
{
    Task<ProgressDto> GetUserProgressAsync(string userId, CancellationToken cancellationToken = default);
}

public class ProgressService(
    IAvatarProgressRepository repository,
    IUserContextService userContextService) : IProgressService
{
    public async Task<ProgressDto> GetUserProgressAsync(string userId, CancellationToken cancellationToken = default)
    {
        var householdId = userContextService.GetCurrentHouseholdId()
       ?? throw new InvalidOperationException(
           "Användaren tillhör inget hushåll.");
        var progress = await repository.GetByUserAsync(userId, householdId, cancellationToken);

        if (progress == null)
            return new ProgressDto { CurrentLevel = 1, CurrentXp = 0, DailyProgressPercent = 0 };

        return new ProgressDto { CurrentLevel = progress.CurrentLevel, CurrentXp = progress.CurrentXp, DailyProgressPercent = progress.DailyProgressPercent };
    }
}
