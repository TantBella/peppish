using API_Peppish.Data;
using API_Peppish.DTOs;
using API_Peppish.Entities;
using API_Peppish.Repositories;
using Microsoft.EntityFrameworkCore;

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

  Task<bool> DeleteAsync(
      Guid id,
      CancellationToken cancellationToken = default);
}

public class ChoreTemplateService(
    IChoreTemplateRepository repository,
    IUserContextService userContextService,
    AppDbContext dbContext) : IChoreTemplateService
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

    var userId = userContextService.GetCurrentUserId();
    var role = userContextService.GetCurrentUserRole();

    return await repository.GetVisibleByUserAsync(
        householdId,
        userId,
        role,
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

    if (userContextService.GetCurrentUserRole() != "ADULT")
      throw new UnauthorizedAccessException(
          "Endast vuxna får ändra quests.");

    template.Title =
        request.Title ?? template.Title;

    template.Description =
        request.Description ?? template.Description;

    if (request.RewardValue.HasValue)
      template.RewardValue = request.RewardValue.Value;

    await repository.UpdateAsync(
        template,
        cancellationToken);

    await repository.SaveChangesAsync(
        cancellationToken);

    return template;
  }

    public async Task<bool> DeleteAsync(
            Guid id,
            CancellationToken cancellationToken = default)
    {
        if (userContextService.GetCurrentUserRole() != "ADULT")
            throw new UnauthorizedAccessException(
                    "Endast vuxna får radera quests.");

        var householdId = userContextService.GetCurrentHouseholdId()
                ?? throw new InvalidOperationException(
                        "Användaren tillhör inget hushåll.");

        var template = await repository.GetByIdAsync(id, householdId, cancellationToken);
        if (template == null)
            return false;

        var assignments = await dbContext.ChoreAssignments
            .Where(a => a.ChoreTemplateId == id && a.HouseholdId == householdId)
            .ToListAsync(cancellationToken);
        var assignmentIds = assignments.Select(a => a.Id).ToList();
        var instances = await dbContext.ChoreInstances
                .Where(i => assignmentIds.Contains(i.ChoreAssignmentId))
                .ToListAsync(cancellationToken);

        dbContext.ChoreInstances.RemoveRange(instances);
        dbContext.ChoreAssignments.RemoveRange(assignments);
        await repository.DeleteAsync(template, cancellationToken);
        await repository.SaveChangesAsync(cancellationToken);
        return true;
    }
}
