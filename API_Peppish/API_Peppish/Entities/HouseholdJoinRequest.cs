namespace API_Peppish.Entities
{
    public class HouseholdJoinRequest
    {
        public Guid Id { get; set; } = Guid.NewGuid();

        public string UserId { get; set; } = string.Empty;

        public Guid HouseholdId { get; set; }

        public Guid JoinCodeId { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public JoinRequestStatus Status { get; set; } = JoinRequestStatus.Pending;
    }
}
