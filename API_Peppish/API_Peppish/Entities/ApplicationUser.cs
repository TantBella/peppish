
using Microsoft.AspNetCore.Identity;

namespace API_Peppish.Entities
{
    public class ApplicationUser : IdentityUser
    {
        public string DisplayName { get; set; } = string.Empty;
        public Guid? HouseholdId { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

public string? Hairstyle { get; set; }
public string? SkinColor { get; set; }
public string? EyeColor { get; set; }
public string? EyebrowColor { get; set; }
public string? HairColor { get; set; }
    }
}
