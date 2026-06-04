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

    public decimal RewardValue { get; set; }

    public string RewardType { get; set; } = string.Empty;
}

public class AssignChoreRequest
{
  public Guid ChoreTemplateId { get; set; }
  public string AssignedToUserId { get; set; } = string.Empty;
  public DateTime StartDate { get; set; }
}

public class ChoreCompletion
{
    public string Id { get; set; }

    public string UserId { get; set; }

    public string ChoreId { get; set; }

    public DateTime CompletedAt { get; set; }

    public RewardDto Reward { get; set; }
}
