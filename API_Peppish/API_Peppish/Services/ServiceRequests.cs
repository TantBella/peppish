using API_Peppish.Entities;

namespace API_Peppish.Services;

public class CreateChoreTemplateRequest
{
  public string Title { get; set; } = string.Empty;
  public string Description { get; set; } = string.Empty;
  public decimal RewardValue { get; set; }
  public RewardType RewardType { get; set; }
  public RecurrenceType Recurrence { get; set; }
}

public class AssignChoreRequest
{
  public Guid ChoreTemplateId { get; set; }
  public string AssignedToUserId { get; set; } = string.Empty;
  public DateTime StartDate { get; set; }
}
