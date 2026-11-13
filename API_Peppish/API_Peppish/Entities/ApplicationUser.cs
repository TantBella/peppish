
using Microsoft.AspNetCore.Identity;

namespace API_Peppish.Entities
{
    public class ApplicationUser : IdentityUser
    {
        public string DisplayName { get; set; } = string.Empty;
        public Guid? HouseholdId { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public string Hairstyle { get; set; } = "short";
        public string SkinColor { get; set; } = "#FFDBB4";
        public string EyeColor { get; set; } = "#5B3828";
        public string EyebrowColor { get; set; } = "#433A30";
        public string HairColor { get; set; } = "#624A2F";
    }
}
