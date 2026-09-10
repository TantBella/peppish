namespace API_Peppish.DTOs
{
  // vad API:t skickar till frontend
  public class ChoreInstanceDto
  {
    public Guid Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public DateTime? DueDate { get; set; }
    public string Status { get; set; } = string.Empty;
    public string? AssignedToUserId { get; set; }
    public string AssignedToUserName { get; set; } = string.Empty;
    public decimal RewardValue { get; set; }
    public string RewardType { get; set; } = string.Empty;
  }
}
