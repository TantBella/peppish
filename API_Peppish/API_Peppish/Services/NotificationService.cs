using API_Peppish.DTOs;
using API_Peppish.Entities;
using API_Peppish.Repositories;

namespace API_Peppish.Services;

public interface INotificationService
{
    Task<List<NotificationDto>> GetUserNotificationsAsync(string userId, CancellationToken cancellationToken = default);
    Task<NotificationDto> CreateNotificationAsync(CreateNotificationRequest request, CancellationToken cancellationToken = default);
    Task MarkAsReadAsync(Guid id, CancellationToken cancellationToken = default);
    Task DeleteAsync(Guid id, CancellationToken cancellationToken = default);
}

public class NotificationService(
    INotificationRepository repository,
    IUserContextService userContextService) : INotificationService
{
    public async Task<List<NotificationDto>> GetUserNotificationsAsync(string userId, CancellationToken cancellationToken = default)
    {
        var householdId = userContextService.GetCurrentHouseholdId();
        var notifs = await repository.GetByUserAsync(userId, householdId, cancellationToken);
        return notifs.Select(n => new NotificationDto
        {
            Id = n.Id,
            UserId = n.UserId,
            HouseholdId = n.HouseholdId,
            Type = n.Type,
            Payload = n.Payload,
            IsRead = n.IsRead,
            CreatedAt = n.CreatedAt,
            ReadAt = n.ReadAt
        }).ToList();
    }

    public async Task<NotificationDto> CreateNotificationAsync(CreateNotificationRequest request, CancellationToken cancellationToken = default)
    {
        var householdId = request.HouseholdId ?? userContextService.GetCurrentHouseholdId();
        var notification = new Notification
        {
            UserId = request.UserId,
            HouseholdId = householdId,
            Type = request.Type,
            Payload = request.Payload,
            IsRead = false,
            CreatedAt = DateTime.UtcNow
        };

        await repository.CreateAsync(notification, cancellationToken);
        await repository.SaveChangesAsync(cancellationToken);

        return new NotificationDto
        {
            Id = notification.Id,
            UserId = notification.UserId,
            HouseholdId = notification.HouseholdId,
            Type = notification.Type,
            Payload = notification.Payload,
            IsRead = notification.IsRead,
            CreatedAt = notification.CreatedAt,
            ReadAt = notification.ReadAt
        };
    }

    public async Task MarkAsReadAsync(Guid id, CancellationToken cancellationToken = default)
    {
        var householdId = userContextService.GetCurrentHouseholdId();
        var notif = await repository.GetByIdAsync(id, householdId, cancellationToken);
        if (notif == null) throw new InvalidOperationException("Notification not found");
        notif.IsRead = true;
        notif.ReadAt = DateTime.UtcNow;
        await repository.SaveChangesAsync(cancellationToken);
    }

    public async Task DeleteAsync(Guid id, CancellationToken cancellationToken = default)
    {
        var householdId = userContextService.GetCurrentHouseholdId();
        var notif = await repository.GetByIdAsync(id, householdId, cancellationToken);
        if (notif == null) throw new InvalidOperationException("Notification not found");
        notif.IsDeleted = true;
        await repository.SaveChangesAsync(cancellationToken);
    }
}