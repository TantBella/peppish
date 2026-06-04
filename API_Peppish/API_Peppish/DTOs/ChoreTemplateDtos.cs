namespace API_Peppish.DTOs;

public class ChoreTemplateDto
{
  public Guid Id { get; set; }
  public string Title { get; set; } = string.Empty;
  public string Description { get; set; } = string.Empty;
  public decimal RewardAmount { get; set; }
  public int RewardPoints { get; set; }
  public string Recurrence { get; set; } = string.Empty;
}

public class CreateChoreTemplateRequest
{
  public string Title { get; set; } = string.Empty;
  public string Description { get; set; } = string.Empty;
  public decimal RewardAmount { get; set; }
  public int RewardPoints { get; set; }
  public string Recurrence { get; set; } = string.Empty;
}

public class UpdateChoreTemplateRequest
{
    public string? Title { get; set; }
    public string? Description { get; set; }
    public decimal RewardAmount { get; set; }
    public int RewardPoints { get; set; }
    public string Recurrence { get; set; } = string.Empty;
}