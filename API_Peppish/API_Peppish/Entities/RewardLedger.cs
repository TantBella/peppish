namespace API_Peppish.Entities;

public class RewardLedger
{
    public Guid Id { get; set; } = Guid.NewGuid();

    public Guid HouseholdId { get; set; }

    public Guid ChoreId { get; set; }

    public string UserId { get; set; } = string.Empty;

    public decimal MoneyAmount { get; set; }

    public int XpAmount { get; set; }

    public string Reason { get; set; } = string.Empty;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}