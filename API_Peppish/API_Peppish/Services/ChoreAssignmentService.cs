using API_Peppish.Data;
using API_Peppish.DTOs;
using API_Peppish.Entities;
using API_Peppish.Repositories;
using Microsoft.EntityFrameworkCore;

namespace API_Peppish.Services
{
    public interface IChoreAssignmentService
    {
        Task<ChoreAssignment> AssignAsync(
            AssignChoreRequestDto request,
            CancellationToken cancellationToken = default);

        Task<List<ChoreAssignment>> GetAvailableAssignmentsAsync(
    CancellationToken cancellationToken = default);

        Task<ChoreAssignment> TakeFreeQuestAsync(
Guid assignmentId,
CancellationToken cancellationToken = default);

        Task<List<ChoreAssignment>> GetUserAssignmentsAsync(
            string userId,
            CancellationToken cancellationToken = default);
    }

    public class ChoreAssignmentService(
        IChoreAssignmentRepository repository,
        IUserContextService userContextService,
        AppDbContext dbContext,
        INotificationService notificationService) : IChoreAssignmentService
    {
        public async Task<ChoreAssignment> AssignAsync(
            AssignChoreRequestDto request,
            CancellationToken cancellationToken = default)
        {
            var householdId = userContextService.GetCurrentHouseholdId()
                ?? throw new InvalidOperationException(
                    "Användaren tillhör inget hushåll.");

            var userId = userContextService.GetCurrentUserId();

            var template = await dbContext.ChoreTemplates
                .FirstOrDefaultAsync(
                    t =>
                        t.Id == request.ChoreTemplateId &&
                        t.HouseholdId == householdId,
                    cancellationToken)
                ?? throw new InvalidOperationException(
                    "Questen kunde inte hittas.");

            if (request.AssignedToUserId != null)
            {
                var assignedUser = await dbContext.Users
                    .FirstOrDefaultAsync(
                        u =>
                            u.Id == request.AssignedToUserId &&
                            u.HouseholdId == householdId,
                        cancellationToken);

                if (assignedUser == null)
                {
                    throw new InvalidOperationException(
                        "Användaren kunde inte hittas i hushållet.");
                }
            }

            var assignment = new ChoreAssignment
            {
                HouseholdId = householdId,
                ChoreTemplateId = request.ChoreTemplateId,
                AssignedToUserId = request.AssignedToUserId,
                AssignedByUserId = userId,
                StartDate = request.StartDate.HasValue
         ? DateTime.SpecifyKind(request.StartDate.Value, DateTimeKind.Utc)
         : null,
                DueDate = request.DueDate.HasValue
         ? DateTime.SpecifyKind(request.DueDate.Value, DateTimeKind.Utc)
         : null
            };

            await repository.CreateAsync(
                assignment,
                cancellationToken);
            await repository.SaveChangesAsync(
                cancellationToken);

            if (assignment.AssignedToUserId != null)
            {
                try
                {
                    var payload =
                        System.Text.Json.JsonSerializer.Serialize(
                            new
                            {
                                assignmentId = assignment.Id,
                                templateId = assignment.ChoreTemplateId,
                                startDate = assignment.StartDate,
                                dueDate = assignment.DueDate
                            });

                    await notificationService.CreateNotificationAsync(
                        new CreateNotificationRequest
                        {
                            UserId = assignment.AssignedToUserId,
                            Type = "chore_assigned",
                            Payload = payload,
                            HouseholdId = assignment.HouseholdId
                        });
                }
                catch
                {
                    // Notiser ska inte göra att tilldelningen misslyckas.
                }
            }

            return assignment;
        }

        public async Task<List<ChoreAssignment>> GetAvailableAssignmentsAsync(
    CancellationToken cancellationToken = default)
        {
            var householdId = userContextService.GetCurrentHouseholdId()
                ?? throw new InvalidOperationException(
                    "Användaren tillhör inget hushåll.");

            return await repository.GetAvailableAsync(
                householdId,
                cancellationToken);
        }

        public async Task<ChoreAssignment> TakeFreeQuestAsync(
            Guid assignmentId,
            CancellationToken cancellationToken = default)
        {
            var householdId = userContextService.GetCurrentHouseholdId()
                ?? throw new InvalidOperationException(
                    "Användaren tillhör inget hushåll.");

            var userId = userContextService.GetCurrentUserId();

            var assignment = await repository.GetByIdAsync(
                assignmentId,
                householdId,
                cancellationToken);

            if (assignment == null)
            {
                throw new InvalidOperationException(
                    "Questen kunde inte hittas.");
            }

            if (assignment.AssignedToUserId != null)
            {
                throw new InvalidOperationException(
                    "Questen är redan tilldelad.");
            }

            assignment.AssignedToUserId = userId;

            await repository.SaveChangesAsync(cancellationToken);

            return assignment;
        }
        public async Task<List<ChoreAssignment>> GetUserAssignmentsAsync(
            string userId,
            CancellationToken cancellationToken = default)
        {
            var householdId = userContextService.GetCurrentHouseholdId()
                ?? throw new InvalidOperationException(
                    "Användaren tillhör inget hushåll.");

            return await repository.GetByUserAsync(
                userId,
                householdId,
                cancellationToken);
        }
    }
}
