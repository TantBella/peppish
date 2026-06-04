namespace API_Peppish.Entities;

public enum RecurrenceType
{
    None = 0,
    Daily = 1,
    Weekly = 2
}
public class ChoreTemplate
{
    public Guid Id { get; set; } = Guid.NewGuid();

    public Guid HouseholdId { get; set; }

    public string Title { get; set; } = string.Empty;

    public string Description { get; set; } = string.Empty;

    public decimal RewardValue { get; set; }

    public RewardType RewardType { get; set; }

    public RecurrenceType Recurrence { get; set; } = RecurrenceType.None;

    public string CreatedByUserId { get; set; } = string.Empty;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}