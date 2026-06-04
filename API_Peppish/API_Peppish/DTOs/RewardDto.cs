namespace API_Peppish.DTOs;

public class RewardDto
{
    public decimal MoneyAmount { get; set; }

    public int XpAmount { get; set; }

    public string Reason { get; set; } = string.Empty;

    public DateTime CreatedAt { get; set; }
}
