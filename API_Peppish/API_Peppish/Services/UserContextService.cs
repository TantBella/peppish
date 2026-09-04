using API_Peppish.Data;
using System.Security.Claims;

namespace API_Peppish.Services
{

    public interface IUserContextService
    {
        string GetCurrentUserId();
        Guid? GetCurrentHouseholdId();
        string GetCurrentUserRole();
    }

    public class UserContextService(IHttpContextAccessor httpContextAccessor, AppDbContext dbContext) : IUserContextService
    {
        public string GetCurrentUserId()
        {
            return httpContextAccessor.HttpContext?.User.FindFirst(ClaimTypes.NameIdentifier)?.Value
                ?? throw new InvalidOperationException("Användar-ID kunde inte hittas");
        }

        public Guid? GetCurrentHouseholdId()
        {
            var userId = GetCurrentUserId();

            var user = dbContext.Users
                .FirstOrDefault(u => u.Id == userId);

            if (user == null)
                throw new InvalidOperationException(
                    "Användaren kunde inte hittas");

            return user.HouseholdId;
        }

        public string GetCurrentUserRole()
        {
            return httpContextAccessor.HttpContext?.User.FindFirst(ClaimTypes.Role)?.Value
                ?? "Adult";
        }
    }
}