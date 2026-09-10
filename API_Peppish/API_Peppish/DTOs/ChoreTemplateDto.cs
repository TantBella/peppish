namespace API_Peppish.DTOs
{
  // vad API:t skickar tillbaka
  public class ChoreTemplateDto
  {
    public Guid Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public decimal RewardValue { get; set; }
    public string RewardType { get; set; } = string.Empty;
    public string Recurrence { get; set; } = string.Empty;
  }
}
