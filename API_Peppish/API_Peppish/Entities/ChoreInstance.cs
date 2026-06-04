namespace API_Peppish.Entities;

public enum ChoreStatus
{
    Pending = 0,
    Completed = 1,
    Approved = 2
}

public class ChoreInstance
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid HouseholdId { get; set; }
    public Guid ChoreAssignmentId { get; set; }
    public DateTime DueDate { get; set; }
    public ChoreStatus Status { get; set; } = ChoreStatus.Pending;
    public Guid? RewardLedgerId { get; set; }
    public DateTime? CompletedAt { get; set; }
    public DateTime? ApprovedAt { get; set; }
    public string? ApprovedByUserId { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
