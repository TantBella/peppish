namespace API_Peppish.DTOs
{
  // vad frontend skickar vid tilldelning
  public class AssignChoreRequestDto
  {
    public Guid ChoreTemplateId { get; set; }
    public string? AssignedToUserId { get; set; }
    public DateTime? StartDate { get; set; }
    public DateTime? DueDate { get; set; }
  }
}
