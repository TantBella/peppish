namespace API_Peppish.Entities
{
// Det som frontend skickar vid tilldelningoch det som API:t skickar tillbaka kopplas till denna entitet
  public class ChoreAssignment
  {
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid HouseholdId { get; set; }
    public Guid ChoreTemplateId { get; set; }
    public string? AssignedToUserId { get; set; }
    public string AssignedByUserId { get; set; } = string.Empty;
    public DateTime? StartDate { get; set; }
    public DateTime? DueDate { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
  }
}
