using API_Peppish.Data;
using API_Peppish.Entities;
using Microsoft.EntityFrameworkCore;

namespace API_Peppish.Repositories;

public interface INotificationRepository
{
    Task<List<Notification>> GetByUserAsync(string userId, Guid householdId, CancellationToken cancellationToken = default);
    Task<Notification> CreateAsync(Notification notification, CancellationToken cancellationToken = default);
    Task<Notification?> GetByIdAsync(Guid id, Guid householdId, CancellationToken cancellationToken = default);
    Task SaveChangesAsync(CancellationToken cancellationToken = default);
}

public class NotificationRepository(AppDbContext context) : INotificationRepository
{
    public async Task<List<Notification>> GetByUserAsync(string userId, Guid householdId, CancellationToken cancellationToken = default)
    {
        return await context.Set<Notification>()
            .Where(n => n.UserId == userId && (n.HouseholdId == null || n.HouseholdId == householdId) && !n.IsDeleted)
            .OrderByDescending(n => n.CreatedAt)
            .ToListAsync(cancellationToken);
    }

    public async Task<Notification> CreateAsync(Notification notification, CancellationToken cancellationToken = default)
    {
        await context.Set<Notification>().AddAsync(notification, cancellationToken);
        return notification;
    }

    public async Task<Notification?> GetByIdAsync(Guid id, Guid householdId, CancellationToken cancellationToken = default)
    {
        return await context.Set<Notification>().FirstOrDefaultAsync(n => n.Id == id && (n.HouseholdId == null || n.HouseholdId == householdId) && !n.IsDeleted, cancellationToken);
    }

    public async Task SaveChangesAsync(CancellationToken cancellationToken = default)
    {
        await context.SaveChangesAsync(cancellationToken);
    }
}