
namespace API_Peppish.DTOs
{
    public class UserDto
    {
        public string Id { get; set; } = string.Empty;
        public string Name { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public Guid? HouseholdId { get; set; }
        public string Role { get; set; } = string.Empty;

        public string Hairstyle { get; set; } = "short";
        public string SkinColor { get; set; } = "#FFDBB4";
        public string EyeColor { get; set; } = "#5B3828";
        public string EyebrowColor { get; set; } = "#433A30";
        public string HairColor { get; set; } = "#624A2F";
    }
}
