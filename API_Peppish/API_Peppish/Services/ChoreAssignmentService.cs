using API_Peppish.Data;
using API_Peppish.Entities;
using API_Peppish.Repositories;
using Microsoft.EntityFrameworkCore;

namespace API_Peppish.Services;

public interface IChoreAssignmentService
{
    Task<ChoreAssignment> AssignAsync(
        AssignChoreRequest request,
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
        AssignChoreRequest request,
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
                "Chore template not found");

        var assignedUser = await dbContext.Users
            .FirstOrDefaultAsync(
                u =>
                    u.Id == request.AssignedToUserId &&
                    u.HouseholdId == householdId,
                cancellationToken)
            ?? throw new InvalidOperationException(
                "User not found in this household");

        var assignment = new ChoreAssignment
        {
            HouseholdId = householdId,
            ChoreTemplateId = request.ChoreTemplateId,
            AssignedToUserId = request.AssignedToUserId,
            AssignedByUserId = userId,
            StartDate = request.StartDate
        };

        await repository.CreateAsync(
            assignment,
            cancellationToken);

        await repository.SaveChangesAsync(
            cancellationToken);

        try
        {
            var payload =
                System.Text.Json.JsonSerializer.Serialize(
                    new
                    {
                        assignmentId = assignment.Id,
                        templateId = assignment.ChoreTemplateId,
                        startDate = assignment.StartDate
                    });

            await notificationService.CreateNotificationAsync(
                new API_Peppish.DTOs.CreateNotificationRequest
                {
                    UserId = assignment.AssignedToUserId,
                    Type = "chore_assigned",
                    Payload = payload,
                    HouseholdId = assignment.HouseholdId
                });
        }
        catch
        {
            // Notificationer ska inte göra att tilldelningen misslyckas.
        }

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