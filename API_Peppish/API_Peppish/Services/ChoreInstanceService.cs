using API_Peppish.Data;
using API_Peppish.DTOs;
using API_Peppish.Entities;
using API_Peppish.Repositories;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace API_Peppish.Services;

public interface IChoreInstanceService
{
    Task<List<ChoreInstance>> GetByDateRangeAsync(DateTime from, DateTime to, CancellationToken cancellationToken = default);
    Task<List<ChoreInstanceDto>> GetByDateRangeAsDto(DateTime from, DateTime to, CancellationToken cancellationToken = default);
    Task<ChoreInstance?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default);
    Task<ChoreInstance> CompleteAsync(Guid id, CancellationToken cancellationToken = default);
    Task<ChoreInstance> ApproveAsync(Guid id, CancellationToken cancellationToken = default);
}

public class ChoreInstanceService(
    IChoreInstanceRepository instanceRepository,
    IRewardRepository rewardRepository,
    IAvatarProgressRepository progressRepository,
    IUserContextService userContextService,
    UserManager<ApplicationUser> userManager,
    AppDbContext dbContext,
    ILogger<ChoreInstanceService> logger) : IChoreInstanceService
{
    public async Task<List<ChoreInstance>> GetByDateRangeAsync(DateTime from, DateTime to, CancellationToken cancellationToken = default)
    {
        var householdId = userContextService.GetCurrentHouseholdId();
        var instances = await instanceRepository.GetByDateRangeAsync(householdId, from, to, cancellationToken);
        
        // Generate missing instances for this date range
        await GenerateMissingInstancesAsync(from, to, householdId, cancellationToken);
        
        return instances;
    }

    public async Task<List<ChoreInstanceDto>> GetByDateRangeAsDto(DateTime from, DateTime to, CancellationToken cancellationToken = default)
    {
        var instances = await GetByDateRangeAsync(from, to, cancellationToken);
        var dtos = new List<ChoreInstanceDto>();

        foreach (var instance in instances)
        {
            // Get the assignment for this instance
            var assignment = await dbContext.ChoreAssignments.FindAsync(new object[] { instance.ChoreAssignmentId }, cancellationToken: cancellationToken);
            if (assignment == null) continue;

            // Get the user assigned to this chore
            var user = await userManager.FindByIdAsync(assignment.AssignedToUserId);
            
            // Get the template for chore details
            var template = await dbContext.ChoreTemplates.FindAsync(new object[] { assignment.ChoreTemplateId }, cancellationToken: cancellationToken);

            dtos.Add(new ChoreInstanceDto
            {
                Id = instance.Id,
                Title = template?.Title ?? string.Empty,
                DueDate = instance.DueDate,
                Status = instance.Status.ToString(),
                AssignedToUserId = assignment.AssignedToUserId,
                AssignedToUserName = user?.DisplayName ?? string.Empty,
                RewardAmount = template?.RewardAmount ?? 0
            });
        }

        return dtos;
    }

    public async Task<ChoreInstance?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default)
    {
        var householdId = userContextService.GetCurrentHouseholdId();
        return await instanceRepository.GetByIdAsync(id, householdId, cancellationToken);
    }

    public async Task<ChoreInstance> CompleteAsync(Guid id, CancellationToken cancellationToken = default)
    {
        var householdId = userContextService.GetCurrentHouseholdId();
        var userId = userContextService.GetCurrentUserId();
        var instance = await instanceRepository.GetByIdAsync(id, householdId, cancellationToken)
            ?? throw new InvalidOperationException("Chore instance not found");

        // Verify user is assigned to this chore
        var assignment = await dbContext.ChoreAssignments.FindAsync(new object[] { instance.ChoreAssignmentId }, cancellationToken: cancellationToken)
            ?? throw new InvalidOperationException("Assignment not found");

        if (assignment.AssignedToUserId != userId)
            throw new UnauthorizedAccessException("You are not assigned to this chore");

        if (instance.Status != ChoreStatus.Pending)
            throw new InvalidOperationException($"Cannot complete chore with status {instance.Status}");

        instance.Status = ChoreStatus.Completed;
        instance.CompletedAt = DateTime.UtcNow;
        
        await instanceRepository.UpdateAsync(instance, cancellationToken);
        logger.LogInformation("Chore {choreId} marked as completed by {userId}", id, userId);
        
        return instance;
    }

    public async Task<ChoreInstance> ApproveAsync(Guid id, CancellationToken cancellationToken = default)
    {
        var householdId = userContextService.GetCurrentHouseholdId();
        var userId = userContextService.GetCurrentUserId();
        var role = userContextService.GetCurrentUserRole();

        if (role != "Adult")
            throw new UnauthorizedAccessException("Only adults can approve chores");

        var instance = await instanceRepository.GetByIdAsync(id, householdId, cancellationToken)
            ?? throw new InvalidOperationException("Chore instance not found");

        if (instance.Status != ChoreStatus.Completed)
            throw new InvalidOperationException($"Cannot approve chore with status {instance.Status}. Must be Completed first.");

        // Use transaction for atomic operations
        using var transaction = await dbContext.Database.BeginTransactionAsync(cancellationToken);
        try
        {
            // Update instance
            instance.Status = ChoreStatus.Approved;
            instance.ApprovedAt = DateTime.UtcNow;
            instance.ApprovedByUserId = userId;
            await instanceRepository.UpdateAsync(instance, cancellationToken);

            // Get assignment for reward info
            var assignment = await dbContext.ChoreAssignments.FindAsync(new object[] { instance.ChoreAssignmentId }, cancellationToken: cancellationToken)
                ?? throw new InvalidOperationException("Assignment not found");

            // Get template for reward amounts
            var template = await dbContext.ChoreTemplates.FindAsync(new object[] { assignment.ChoreTemplateId }, cancellationToken: cancellationToken)
                ?? throw new InvalidOperationException("Template not found");

            // Create reward ledger entry
            var reward = new RewardLedger
            {
                HouseholdId = householdId,
                UserId = assignment.AssignedToUserId,
                Amount = template.RewardAmount,
                Reason = $"Completed chore: {template.Title}"
            };
            await rewardRepository.CreateAsync(reward, cancellationToken);
            await rewardRepository.SaveChangesAsync(cancellationToken);

            // Update progress
            var progress = await progressRepository.GetByUserAsync(assignment.AssignedToUserId, householdId, cancellationToken)
                ?? new AvatarProgress { UserId = assignment.AssignedToUserId, HouseholdId = householdId };

            progress.CurrentXp += template.RewardPoints;
            progress.UpdatedAt = DateTime.UtcNow;

            // Calculate level up (every 100 XP = 1 level)
            progress.CurrentLevel = 1 + (progress.CurrentXp / 100);

            await progressRepository.CreateOrUpdateAsync(progress, cancellationToken);
            await progressRepository.SaveChangesAsync(cancellationToken);

            await transaction.CommitAsync(cancellationToken);
            logger.LogInformation("Chore {choreId} approved by {approverUserId}. Reward created for {assignedUserId}", id, userId, assignment.AssignedToUserId);
        }
        catch
        {
            await transaction.RollbackAsync(cancellationToken);
            throw;
        }

        return instance;
    }

    private async Task GenerateMissingInstancesAsync(DateTime from, DateTime to, Guid householdId, CancellationToken cancellationToken)
    {
        var assignments = await dbContext.ChoreAssignments
            .Where(a => a.HouseholdId == householdId && a.StartDate <= to)
            .ToListAsync(cancellationToken);

        foreach (var assignment in assignments)
        {
            var template = await dbContext.ChoreTemplates.FindAsync(new object[] { assignment.ChoreTemplateId }, cancellationToken: cancellationToken);
            if (template == null) continue;

            var startDate = assignment.StartDate > from ? assignment.StartDate : from;
            var currentDate = startDate.Date;

            while (currentDate <= to)
            {
                // Check if instance already exists
                var existing = await instanceRepository.GetByAssignmentAndDateAsync(assignment.Id, currentDate, householdId, cancellationToken);
                if (existing == null)
                {
                    var instance = new ChoreInstance
                    {
                        HouseholdId = householdId,
                        ChoreAssignmentId = assignment.Id,
                        DueDate = currentDate,
                        Status = ChoreStatus.Pending
                    };
                    await instanceRepository.CreateAsync(instance, cancellationToken);
                }

                // Move to next occurrence based on recurrence
                currentDate = template.Recurrence switch
                {
                    RecurrenceType.Daily => currentDate.AddDays(1),
                    RecurrenceType.Weekly => currentDate.AddDays(7),
                    _ => to.AddDays(1) // None or unknown - exit loop
                };
            }
        }

        await instanceRepository.SaveChangesAsync(cancellationToken);
    }
}
