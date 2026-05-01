using API_Peppish.Data;
using API_Peppish.Entities;
using API_Peppish.Repositories;

namespace API_Peppish.Services;

public interface IChoreTemplateService
{
    Task<ChoreTemplate> CreateAsync(CreateChoreTemplateRequest request, CancellationToken cancellationToken = default);
    Task<List<ChoreTemplate>> GetAllAsync(CancellationToken cancellationToken = default);
    Task<ChoreTemplate?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default);
}

public class ChoreTemplateService(
    IChoreTemplateRepository repository,
    IUserContextService userContextService) : IChoreTemplateService
{
    public async Task<ChoreTemplate> CreateAsync(CreateChoreTemplateRequest request, CancellationToken cancellationToken = default)
    {
        var householdId = userContextService.GetCurrentHouseholdId();
        var userId = userContextService.GetCurrentUserId();

        var template = new ChoreTemplate
        {
            HouseholdId = householdId,
            Title = request.Title,
            Description = request.Description,
            RewardAmount = request.RewardAmount,
            RewardPoints = request.RewardPoints,
            Recurrence = request.Recurrence,
            CreatedByUserId = userId
        };

        await repository.CreateAsync(template, cancellationToken);
        await repository.SaveChangesAsync(cancellationToken);
        return template;
    }

    public async Task<List<ChoreTemplate>> GetAllAsync(CancellationToken cancellationToken = default)
    {
        var householdId = userContextService.GetCurrentHouseholdId();
        return await repository.GetByHouseholdAsync(householdId, cancellationToken);
    }

    public async Task<ChoreTemplate?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default)
    {
        var householdId = userContextService.GetCurrentHouseholdId();
        return await repository.GetByIdAsync(id, householdId, cancellationToken);
    }
}
