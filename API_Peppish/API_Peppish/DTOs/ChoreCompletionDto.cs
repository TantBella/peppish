namespace API_Peppish.DTOs;

public class ChoreCompletionDto
{
    public Guid Id { get; set; }
    public string? AssignedToUserId { get; set; }
  public string ChoreId { get; set; }
  public DateTime CompletedAt { get; set; }
  public RewardDto Reward { get; set; }
}
