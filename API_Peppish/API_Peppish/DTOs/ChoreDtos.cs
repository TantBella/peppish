namespace API_Peppish.DTOs;

public class ChoreAssignmentDto
{
  public Guid Id { get; set; }
  public Guid ChoreTemplateId { get; set; }
  public string AssignedToUserId { get; set; } = string.Empty;
  public string AssignedToUserName { get; set; } = string.Empty;
  public DateTime StartDate { get; set; }
}

public class ChoreInstanceDto
{
  public Guid Id { get; set; }
  public string Title { get; set; } = string.Empty;
  public DateTime DueDate { get; set; }
  public string Status { get; set; } = string.Empty;
  public string AssignedToUserId { get; set; } = string.Empty;
  public string AssignedToUserName { get; set; } = string.Empty;
  public decimal RewardAmount { get; set; }
}

public class AssignChoreRequest
{
  public Guid ChoreTemplateId { get; set; }
  public string AssignedToUserId { get; set; } = string.Empty;
  public DateTime StartDate { get; set; }
}
