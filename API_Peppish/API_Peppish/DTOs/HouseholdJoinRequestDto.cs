namespace API_Peppish.DTOs
{
    public class HouseholdJoinRequestDto
    {
        public Guid Id { get; set; }
        public string UserId { get; set; } = string.Empty;
        public Guid HouseholdId { get; set; }
        public DateTime CreatedAt { get; set; }
        public string Status { get; set; } = string.Empty;
    }
}
