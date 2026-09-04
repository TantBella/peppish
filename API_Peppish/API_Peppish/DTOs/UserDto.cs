namespace API_Peppish.DTOs
{
    public class UserDto
    {
        public string Id { get; set; } = string.Empty;
        public string Name { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public Guid? HouseholdId { get; set; }
        public string Role { get; set; } = string.Empty;
    }
}