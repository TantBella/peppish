using API_Peppish.Data;
using API_Peppish.Entities;
using API_Peppish.Repositories;
using API_Peppish.Services;
using Microsoft.EntityFrameworkCore;
using Xunit;

namespace API_Peppish.Tests.Services;

public class FakeUserContextService : IUserContextService
{
    private readonly string _userId;
    private readonly Guid _householdId;
    public FakeUserContextService(string userId, Guid householdId)
    {
        _userId = userId;
        _householdId = householdId;
    }

    public string GetCurrentUserId() => _userId;
    public Guid GetCurrentHouseholdId() => _householdId;
    public string GetCurrentUserRole() => "Adult";
}

public class NotificationServiceTests
{
    private AppDbContext CreateContext(string dbName)
    {
        var options = new DbContextOptionsBuilder<AppDbContext>()
            .UseInMemoryDatabase(dbName)
            .Options;
        return new AppDbContext(options);
    }

    [Fact]
    public async Task CreateAndGetNotifications_ForUser_ShouldReturnNotification()
    {
        var userId = "user-1";
        var householdId = Guid.NewGuid();

        using var context = CreateContext(nameof(CreateAndGetNotifications_ForUser_ShouldReturnNotification));
        var repo = new NotificationRepository(context);
        var userContext = new FakeUserContextService(userId, householdId);
        var service = new NotificationService(repo, userContext);

        var req = new CreateNotificationRequest { UserId = userId, HouseholdId = householdId, Type = "test", Payload = "{}" };
        var created = await service.CreateNotificationAsync(req);

        Assert.NotNull(created);
        Assert.Equal(userId, created.UserId);

        var list = await service.GetUserNotificationsAsync(userId);
        Assert.Single(list);
        Assert.Equal(created.Id, list[0].Id);
    }
}
