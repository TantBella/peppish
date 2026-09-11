using API_Peppish.Entities;
using API_Peppish.Data;
using Microsoft.EntityFrameworkCore;

namespace API_Peppish.Repositories;

public interface IChoreTemplateRepository
{
  Task<ChoreTemplate?> GetByIdAsync(Guid id, Guid householdId, CancellationToken cancellationToken = default);
  Task<List<ChoreTemplate>> GetByHouseholdAsync(Guid householdId, CancellationToken cancellationToken = default);
  Task<List<ChoreTemplate>> GetVisibleByUserAsync(
      Guid householdId,
      string userId,
      string role,
      CancellationToken cancellationToken = default);
  Task<ChoreTemplate> CreateAsync(ChoreTemplate template, CancellationToken cancellationToken = default);
  Task UpdateAsync(ChoreTemplate template, CancellationToken cancellationToken = default);
  Task SaveChangesAsync(CancellationToken cancellationToken = default);
}

public class ChoreTemplateRepository : IChoreTemplateRepository
{
  private readonly AppDbContext context;

  public ChoreTemplateRepository(AppDbContext context)
  {
    this.context = context;
  }

  public async Task<ChoreTemplate?> GetByIdAsync(
      Guid id,
      Guid householdId,
      CancellationToken cancellationToken = default)
  {
    return await context.ChoreTemplates
        .FirstOrDefaultAsync(t => t.Id == id && t.HouseholdId == householdId, cancellationToken);
  }

  public async Task<List<ChoreTemplate>> GetByHouseholdAsync(
      Guid householdId,
      CancellationToken cancellationToken = default)
  {
    return await context.ChoreTemplates
        .Where(t => t.HouseholdId == householdId)
        .ToListAsync(cancellationToken);
  }

  public async Task<List<ChoreTemplate>> GetVisibleByUserAsync(
      Guid householdId,
      string userId,
      string role,
      CancellationToken cancellationToken = default)
  {
    var query = context.ChoreTemplates
        .Where(t => t.HouseholdId == householdId);

    if (role == "ADULT")
    {
      query = query.Where(t =>
          context.ChoreAssignments.Any(a =>
              a.ChoreTemplateId == t.Id &&
              a.HouseholdId == householdId &&
          (string.IsNullOrEmpty(a.AssignedToUserId) ||
           context.Users.Any(u =>
             u.Id == a.AssignedToUserId &&
             u.HouseholdId == householdId))));
    }
    else
    {
      query = query.Where(t =>
          context.ChoreAssignments.Any(a =>
              a.ChoreTemplateId == t.Id &&
              a.HouseholdId == householdId &&
          (a.AssignedToUserId == userId ||
           string.IsNullOrEmpty(a.AssignedToUserId))));
    }

    return await query.ToListAsync(cancellationToken);
  }

  public Task<ChoreTemplate> CreateAsync(
      ChoreTemplate template,
      CancellationToken cancellationToken = default)
  {
    context.ChoreTemplates.Add(template);
    return Task.FromResult(template);
  }

  public Task UpdateAsync(
      ChoreTemplate template,
      CancellationToken cancellationToken = default)
  {
    context.ChoreTemplates.Update(template);
    return Task.CompletedTask;
  }

  public Task SaveChangesAsync(CancellationToken cancellationToken = default)
  {
    return context.SaveChangesAsync(cancellationToken);
  }
}
