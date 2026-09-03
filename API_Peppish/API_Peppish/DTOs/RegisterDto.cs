namespace API_Peppish.DTOs
{
    public class RegisterDto
    {
        public string Username { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
        public string HouseholdName { get; set; } = string.Empty;
        public string Role { get; set; } = string.Empty;
    }
}
