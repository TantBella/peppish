namespace API_Peppish.Entities;

public class AvatarProgress
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid HouseholdId { get; set; }
    public string UserId { get; set; } = string.Empty;
    public int CurrentLevel { get; set; } = 1;
    public int CurrentXp { get; set; } = 0;
    public int DailyProgressPercent { get; set; } = 0;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
}
