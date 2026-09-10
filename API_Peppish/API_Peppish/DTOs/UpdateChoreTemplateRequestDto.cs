namespace API_Peppish.DTOs
{
  // vad frontend skickar vid ändring
  public class UpdateChoreTemplateRequestDto
  {
    public string? Title { get; set; }
    public string? Description { get; set; }
    public decimal RewardValue { get; set; }
    public string RewardType { get; set; } = string.Empty;
    public string Recurrence { get; set; } = string.Empty;
  }
}
