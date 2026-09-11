namespace API_Peppish.Entities
{
  // Det som API:t skickar till frontend kopplas till denna entitet
  public enum ChoreStatus
  {
    available = 0,
    completed = 1,
    approved = 2,
    assigned = 3
  }

  public class ChoreInstance
  {
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid HouseholdId { get; set; }
    public Guid ChoreAssignmentId { get; set; }
    public DateTime DueDate { get; set; }
    public ChoreStatus Status { get; set; } = ChoreStatus.available;
    public Guid? RewardLedgerId { get; set; }
    public DateTime? CompletedAt { get; set; }
    public DateTime? ApprovedAt { get; set; }
    public string? ApprovedByUserId { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
  }
}
