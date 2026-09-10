namespace API_Peppish.DTOs
{
  // vad API:t skickar tillbaka
  public class ChoreAssignmentDto
  {
    public Guid Id { get; set; }
    public Guid ChoreTemplateId { get; set; }
    public string? AssignedToUserId { get; set; } = string.Empty;
    public string AssignedToUserName { get; set; } = string.Empty;
    public DateTime? StartDate { get; set; }
    public DateTime? DueDate { get; set; }
  }
}
