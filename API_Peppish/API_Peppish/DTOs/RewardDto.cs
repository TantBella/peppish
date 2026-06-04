namespace API_Peppish.DTOs;

public class RewardDto
{
  public decimal Amount { get; set; }
  public string Reason { get; set; } = string.Empty;
  public DateTime CreatedAt { get; set; }
}
