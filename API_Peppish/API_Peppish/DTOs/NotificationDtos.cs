namespace API_Peppish.DTOs;

public class NotificationDto
{
  public Guid Id { get; set; }
  public Guid? HouseholdId { get; set; }
  public string UserId { get; set; } = string.Empty;
  public string Type { get; set; } = string.Empty;
  public string Payload { get; set; } = string.Empty;
  public bool IsRead { get; set; }
  public DateTime CreatedAt { get; set; }
  public DateTime? ReadAt { get; set; }
}

public class CreateNotificationRequest
{
  public Guid? HouseholdId { get; set; }
  public string UserId { get; set; } = string.Empty;
  public string Type { get; set; } = string.Empty;
  public string Payload { get; set; } = string.Empty;
}
