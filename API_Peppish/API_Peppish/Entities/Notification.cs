using System;

namespace API_Peppish.Entities;

public class Notification
{
  public Guid Id { get; set; } = Guid.NewGuid();
  public Guid? HouseholdId { get; set; }
  public string UserId { get; set; } = string.Empty;
  public string Type { get; set; } = string.Empty;
  public string Payload { get; set; } = string.Empty;
  public bool IsRead { get; set; } = false;
  public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
  public DateTime? ReadAt { get; set; }
  public bool IsDeleted { get; set; } = false;
}
