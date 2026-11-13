
namespace API_Peppish.DTOs
{
    public class UserDto
    {
        public string Id { get; set; } = string.Empty;
        public string Name { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public Guid? HouseholdId { get; set; }
        public string Role { get; set; } = string.Empty;

public string? Hairstyle { get; set; }
public string? SkinColor { get; set; }
public string? EyeColor { get; set; }
public string? EyebrowColor { get; set; }
public string? HairColor { get; set; }
    }
}
