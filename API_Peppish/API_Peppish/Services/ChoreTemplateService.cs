using API_Peppish.Data;
using API_Peppish.DTOs;
using API_Peppish.Entities;
using API_Peppish.Repositories;

namespace API_Peppish.Services;

public interface IChoreTemplateService
{
  Task<ChoreTemplate> CreateAsync(
      CreateChoreTemplateRequestDto request,
      CancellationToken cancellationToken = default);

  Task<List<ChoreTemplate>> GetAllAsync(
      CancellationToken cancellationToken = default);

  Task<ChoreTemplate?> GetByIdAsync(
      Guid id,
      CancellationToken cancellationToken = default);

  Task<ChoreTemplate?> UpdateAsync(
      Guid id,
      UpdateChoreTemplateRequestDto request,
      CancellationToken cancellationToken = default);
}

public class ChoreTemplateService(
    IChoreTemplateRepository repository,
    IUserContextService userContextService) : IChoreTemplateService
{
  public async Task<ChoreTemplate> CreateAsync(
      CreateChoreTemplateRequestDto request,
      CancellationToken cancellationToken = default)
  {
    var householdId = userContextService.GetCurrentHouseholdId()
        ?? throw new InvalidOperationException(
            "Användaren tillhör inget hushåll.");

    var userId = userContextService.GetCurrentUserId();

        var template = new ChoreTemplate
        {
            HouseholdId = householdId,
            Title = request.Title,
            Description = request.Description,
            RewardValue = request.RewardValue,
            RewardType = Enum.Parse<RewardType>(
                request.RewardType,
                true),
            Recurrence = Enum.Parse<RecurrenceType>(
                request.Recurrence,
                true),
            CreatedByUserId = userId
        };

        await repository.CreateAsync(
        template,
        cancellationToken);

    await repository.SaveChangesAsync(
        cancellationToken);

    return template;
  }

  public async Task<List<ChoreTemplate>> GetAllAsync(
      CancellationToken cancellationToken = default)
  {
    var householdId = userContextService.GetCurrentHouseholdId()
        ?? throw new InvalidOperationException(
            "Anv�ndaren tillh�r inget hush�ll.");

    return await repository.GetByHouseholdAsync(
        householdId,
        cancellationToken);
  }

  public async Task<ChoreTemplate?> GetByIdAsync(
      Guid id,
      CancellationToken cancellationToken = default)
  {
    var householdId = userContextService.GetCurrentHouseholdId()
        ?? throw new InvalidOperationException(
            "Anv�ndaren tillh�r inget hush�ll.");

    return await repository.GetByIdAsync(
        id,
        householdId,
        cancellationToken);
  }

  public async Task<ChoreTemplate?> UpdateAsync(
      Guid id,
      UpdateChoreTemplateRequestDto request,
      CancellationToken cancellationToken = default)
  {
    var householdId = userContextService.GetCurrentHouseholdId()
        ?? throw new InvalidOperationException(
            "Användaren tillhör inget hushåll.");

    var template = await repository.GetByIdAsync(
        id,
        householdId,
        cancellationToken);

    if (template == null)
      return null;

    template.Title =
        request.Title ?? template.Title;

    template.Description =
        request.Description ?? template.Description;

    template.RewardValue =
        request.RewardValue;

    template.RewardType =
        Enum.Parse<RewardType>(
            request.RewardType,
            true);

    template.Recurrence =
        Enum.Parse<RecurrenceType>(
            request.Recurrence,
            true);

    await repository.UpdateAsync(
        template,
        cancellationToken);

    await repository.SaveChangesAsync(
        cancellationToken);

    return template;
  }
}
