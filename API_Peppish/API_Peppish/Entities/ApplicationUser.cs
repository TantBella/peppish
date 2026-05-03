using Microsoft.AspNetCore.Identity;

namespace API_Peppish.Entities;

public class ApplicationUser : IdentityUser
{
    public string DisplayName { get; set; } = string.Empty;
    public Guid HouseholdId { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
