using API_Peppish.Entities;

namespace API_Peppish.DTOs
{
  // vad frontend skickar när en quest ska skapas
  public class CreateChoreTemplateRequestDto
  {
      public string Title { get; set; } = string.Empty;
      public string Description { get; set; } = string.Empty;
      public decimal RewardValue { get; set; }
      public string RewardType { get; set; } = string.Empty;
      public string Recurrence { get; set; } = string.Empty;
    }
}
