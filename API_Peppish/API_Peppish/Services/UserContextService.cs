using API_Peppish.Data;
using System.Security.Claims;

namespace API_Peppish.Services;

public interface IUserContextService
{
    string GetCurrentUserId();
    Guid GetCurrentHouseholdId();
    string GetCurrentUserRole();
}

public class UserContextService(IHttpContextAccessor httpContextAccessor, AppDbContext dbContext) : IUserContextService
{
    public string GetCurrentUserId()
    {
        return httpContextAccessor.HttpContext?.User.FindFirst(ClaimTypes.NameIdentifier)?.Value
            ?? throw new InvalidOperationException("User ID not found");
    }

    public Guid GetCurrentHouseholdId()
    {
        var userId = GetCurrentUserId();
        var user = dbContext.Users
            .FirstOrDefault(u => u.Id == userId);

        if (user == null || user.HouseholdId == Guid.Empty)
            throw new InvalidOperationException("Household ID not found for user");

        return user.HouseholdId;
    }

    public string GetCurrentUserRole()
    {
        return httpContextAccessor.HttpContext?.User.FindFirst(ClaimTypes.Role)?.Value
            ?? "Adult";
    }
}
