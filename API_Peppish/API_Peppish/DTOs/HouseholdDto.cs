namespace API_Peppish.DTOs
{
    public class HouseholdDto
    {
        public Guid Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public List<UserDto> Users { get; set; } = new();
    }
}
