using API_Peppish.Data;
using API_Peppish.DTOs;
using API_Peppish.Entities;
using API_Peppish.Repositories;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace API_Peppish.Services
{
    public interface IChoreInstanceService
    {
        Task<List<ChoreInstance>> GetByDateRangeAsync(
            DateTime from,
            DateTime to,
            CancellationToken cancellationToken = default);

        Task<List<ChoreInstanceDto>> GetByDateRangeAsDto(
            DateTime from,
            DateTime to,
            CancellationToken cancellationToken = default);

        Task<ChoreInstance?> GetByIdAsync(
            Guid id,
            CancellationToken cancellationToken = default);

        Task<ChoreInstance> CompleteAsync(
            Guid id,
            CancellationToken cancellationToken = default);

        Task<ChoreInstance> ApproveAsync(
            Guid id,
            CancellationToken cancellationToken = default);
    }

    public class ChoreInstanceService(
        IChoreInstanceRepository instanceRepository,
        IRewardRepository rewardRepository,
        IAvatarProgressRepository progressRepository,
        IUserContextService userContextService,
        UserManager<ApplicationUser> userManager,
        AppDbContext dbContext,
        ILogger<ChoreInstanceService> logger,
        INotificationService notificationService) : IChoreInstanceService
    {
        public async Task<List<ChoreInstance>> GetByDateRangeAsync(
            DateTime from,
            DateTime to,
            CancellationToken cancellationToken = default)
        {
            var householdId = userContextService.GetCurrentHouseholdId()
                ?? throw new InvalidOperationException(
                    "Användaren tillhör inget hushåll.");

            await GenerateMissingInstancesAsync(
                from,
                to,
                householdId,
                cancellationToken);

            return await instanceRepository.GetByDateRangeAsync(
                householdId,
                from,
                to,
                cancellationToken);
        }

        public async Task<List<ChoreInstanceDto>> GetByDateRangeAsDto(
            DateTime from,
            DateTime to,
            CancellationToken cancellationToken = default)
        {
            var instances = await GetByDateRangeAsync(
                from,
                to,
                cancellationToken);

            var dtos = new List<ChoreInstanceDto>();

            foreach (var instance in instances)
            {
                var assignment = await dbContext.ChoreAssignments.FindAsync(
                    new object[] { instance.ChoreAssignmentId },
                    cancellationToken: cancellationToken);

                if (assignment == null)
                    continue;

                var user = await userManager.FindByIdAsync(
                    assignment.AssignedToUserId);

                var template = await dbContext.ChoreTemplates.FindAsync(
                    new object[] { assignment.ChoreTemplateId },
                    cancellationToken: cancellationToken);

                dtos.Add(new ChoreInstanceDto
                {
                    Id = instance.Id,
                    Title = template?.Title ?? string.Empty,
                    DueDate = instance.DueDate,
                    Status = instance.Status.ToString(),
                    AssignedToUserId = assignment.AssignedToUserId,
                    AssignedToUserName = user?.DisplayName ?? string.Empty,
                    RewardValue = template?.RewardValue ?? 0,
                    RewardType = template?.RewardType.ToString()
                });
            }

            return dtos;
        }

        public async Task<ChoreInstance?> GetByIdAsync(
            Guid id,
            CancellationToken cancellationToken = default)
        {
            var householdId = userContextService.GetCurrentHouseholdId()
                ?? throw new InvalidOperationException(
                    "Användaren tillhör inget hushåll.");

            return await instanceRepository.GetByIdAsync(
                id,
                householdId,
                cancellationToken);
        }

        public async Task<ChoreInstance> CompleteAsync(
            Guid id,
            CancellationToken cancellationToken = default)
        {
            var householdId = userContextService.GetCurrentHouseholdId()
                ?? throw new InvalidOperationException(
                    "Användaren tillhör inget hushåll.");

            var userId = userContextService.GetCurrentUserId();

            var instance = await instanceRepository.GetByIdAsync(
                id,
                householdId,
                cancellationToken)
                ?? throw new InvalidOperationException(
                    "Chore instance not found");

            var assignment = await dbContext.ChoreAssignments.FindAsync(
                new object[] { instance.ChoreAssignmentId },
                cancellationToken: cancellationToken)
                ?? throw new InvalidOperationException(
                    "Assignment not found");

            if (assignment.AssignedToUserId != userId)
                throw new UnauthorizedAccessException(
                    "Denna uppgiften är inte din");

            if (instance.Status != ChoreStatus.Pending)
                throw new InvalidOperationException(
                    $"Kan inte slutföra en syssla med denna status {instance.Status}");

            instance.Status = ChoreStatus.Completed;
            instance.CompletedAt = DateTime.UtcNow;

            await instanceRepository.UpdateAsync(
                instance,
                cancellationToken);

            logger.LogInformation(
                "{choreId} är markerad som färdig av {userId}",
                id,
                userId);

            try
            {
                var payload =
                    System.Text.Json.JsonSerializer.Serialize(
                        new
                        {
                            instanceId = instance.Id,
                            completedBy = userId,
                            completedAt = instance.CompletedAt
                        });

                await notificationService.CreateNotificationAsync(
                    new CreateNotificationRequest
                    {
                        UserId = assignment.AssignedToUserId,
                        Type = "chore_completed",
                        Payload = payload,
                        HouseholdId = householdId
                    });

                var adults = (
                    await userManager.GetUsersInRoleAsync("ADULT"))
                    .Where(u => u.HouseholdId == householdId);

                foreach (var adult in adults)
                {
                    await notificationService.CreateNotificationAsync(
                        new CreateNotificationRequest
                        {
                            UserId = adult.Id,
                            Type = "chore_needs_approval",
                            Payload = payload,
                            HouseholdId = householdId
                        });
                }
            }
            catch
            {
                // Notificationer ska inte göra att sysslan misslyckas.
            }

            return instance;
        }

        public async Task<ChoreInstance> ApproveAsync(
            Guid id,
            CancellationToken cancellationToken = default)
        {
            var householdId = userContextService.GetCurrentHouseholdId()
                ?? throw new InvalidOperationException(
                    "Användaren tillhör inget hushåll.");

            var userId = userContextService.GetCurrentUserId();
            var role = userContextService.GetCurrentUserRole();

            if (role != "ADULT")
                throw new UnauthorizedAccessException(
                    "Endast vuxna kan godkänna att en syssla är slutförd");

            var instance = await instanceRepository.GetByIdAsync(
                id,
                householdId,
                cancellationToken)
                ?? throw new InvalidOperationException(
                    "Chore instance not found");

            if (instance.Status != ChoreStatus.Completed)
                throw new InvalidOperationException(
                    $"Kan inte godkänna en syssla med denna status {instance.Status}. " +
                    "Den måste bli klarmarkerad först.");

            using var transaction =
                await dbContext.Database.BeginTransactionAsync(
                    cancellationToken);

            try
            {
                instance.Status = ChoreStatus.Approved;
                instance.ApprovedAt = DateTime.UtcNow;
                instance.ApprovedByUserId = userId;

                await instanceRepository.UpdateAsync(
                    instance,
                    cancellationToken);

                var assignment = await dbContext.ChoreAssignments.FindAsync(
                    new object[] { instance.ChoreAssignmentId },
                    cancellationToken: cancellationToken)
                    ?? throw new InvalidOperationException(
                        "Assignment not found");

                var template = await dbContext.ChoreTemplates.FindAsync(
                    new object[] { assignment.ChoreTemplateId },
                    cancellationToken: cancellationToken)
                    ?? throw new InvalidOperationException(
                        "Template not found");

                var reward = new RewardLedger
                {
                    HouseholdId = householdId,
                    UserId = assignment.AssignedToUserId,
                    ChoreId = instance.Id,
                    Reason = $"Completed chore: {template.Title}",
                    MoneyAmount =
                        template.RewardType == RewardType.Money
                            ? template.RewardValue
                            : 0,
                    XpAmount =
                        template.RewardType == RewardType.Xp
                            ? (int)template.RewardValue
                            : 0
                };

                await rewardRepository.CreateAsync(
                    reward,
                    cancellationToken);

                await rewardRepository.SaveChangesAsync(
                    cancellationToken);

                var progress =
                    await progressRepository.GetByUserAsync(
                        assignment.AssignedToUserId,
                        householdId,
                        cancellationToken)
                    ?? new AvatarProgress
                    {
                        UserId = assignment.AssignedToUserId,
                        HouseholdId = householdId
                    };

                if (template.RewardType == RewardType.Xp)
                {
                    progress.CurrentXp += reward.XpAmount;
                }

                progress.UpdatedAt = DateTime.UtcNow;
                progress.CurrentLevel =
                    1 + (progress.CurrentXp / 100);

                await progressRepository.CreateOrUpdateAsync(
                    progress,
                    cancellationToken);

                await progressRepository.SaveChangesAsync(
                    cancellationToken);

                await transaction.CommitAsync(
                    cancellationToken);

                logger.LogInformation(
                    "Chore {choreId} approved by {approverUserId}. " +
                    "Reward created for {assignedUserId}",
                    id,
                    userId,
                    assignment.AssignedToUserId);

                try
                {
                    var payload =
                        System.Text.Json.JsonSerializer.Serialize(
                            new
                            {
                                instanceId = instance.Id,
                                approvedBy = userId,
                                approvedAt = instance.ApprovedAt,
                                reward = new
                                {
                                    reward.MoneyAmount,
                                    reward.XpAmount
                                }
                            });

                    await notificationService.CreateNotificationAsync(
                        new CreateNotificationRequest
                        {
                            UserId = assignment.AssignedToUserId,
                            Type = "chore_approved",
                            Payload = payload,
                            HouseholdId = householdId
                        });
                }
                catch
                {
                    // Notificationer ska inte påverka godkännandet.
                }
            }
            catch
            {
                await transaction.RollbackAsync(
                    cancellationToken);

                throw;
            }

            return instance;
        }

        private async Task GenerateMissingInstancesAsync(
            DateTime from,
            DateTime to,
            Guid householdId,
            CancellationToken cancellationToken)
        {
            var assignments = await dbContext.ChoreAssignments
                .Where(a =>
                    a.HouseholdId == householdId &&
                    a.StartDate <= to)
                .ToListAsync(cancellationToken);

            foreach (var assignment in assignments)
            {
                var template =
                    await dbContext.ChoreTemplates.FindAsync(
                        new object[] { assignment.ChoreTemplateId },
                        cancellationToken: cancellationToken);

                if (template == null)
                    continue;

                var startDate =
                    assignment.StartDate > from
                        ? assignment.StartDate
                        : from;

                var currentDate = startDate.Date;

                while (currentDate <= to)
                {
                    var existing =
                        await instanceRepository
                            .GetByAssignmentAndDateAsync(
                                assignment.Id,
                                currentDate,
                                householdId,
                                cancellationToken);

                    if (existing == null)
                    {
                        var instance = new ChoreInstance
                        {
                            HouseholdId = householdId,
                            ChoreAssignmentId = assignment.Id,
                            DueDate = currentDate,
                            Status = ChoreStatus.Pending
                        };

                        await instanceRepository.CreateAsync(
                            instance,
                            cancellationToken);
                    }

                    currentDate = template.Recurrence switch
                    {
                        RecurrenceType.Daily =>
                            currentDate.AddDays(1),

                        RecurrenceType.Weekly =>
                            currentDate.AddDays(7),

                        _ =>
                            to.AddDays(1)
                    };
                }
            }

            await instanceRepository.SaveChangesAsync(
                cancellationToken);
        }
    }
}