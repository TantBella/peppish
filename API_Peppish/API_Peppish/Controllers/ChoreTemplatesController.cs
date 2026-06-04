using API_Peppish.DTOs;
using API_Peppish.Entities;
using API_Peppish.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API_Peppish.Controllers;

[ApiController]
[Route("api/chore-templates")]
[Authorize]
public class ChoreTemplatesController(IChoreTemplateService service) : ControllerBase
{
  [HttpPost]
  public async Task<ActionResult<ChoreTemplateDto>> CreateTemplate([FromBody] DTOs.CreateChoreTemplateRequest request)
  {
    if (string.IsNullOrEmpty(request.Title))
      return BadRequest(new { error = "Title is required" });

    var serviceRequest = new Services.CreateChoreTemplateRequest
    {
      Title = request.Title,
      Description = request.Description,
      RewardAmount = request.RewardAmount,
      RewardPoints = request.RewardPoints,
      Recurrence = Enum.Parse<RecurrenceType>(request.Recurrence, true)
    };

    var template = await service.CreateAsync(serviceRequest);
    return CreatedAtAction(nameof(GetAllTemplates), new ChoreTemplateDto
    {
      Id = template.Id,
      Title = template.Title,
      Description = template.Description,
      RewardAmount = template.RewardAmount,
      RewardPoints = template.RewardPoints,
      Recurrence = template.Recurrence.ToString()
    });
  }

  [HttpGet]
  public async Task<ActionResult<List<ChoreTemplateDto>>> GetAllTemplates()
  {
    var templates = await service.GetAllAsync();
    return Ok(templates.Select(t => new ChoreTemplateDto
    {
      Id = t.Id,
      Title = t.Title,
      Description = t.Description,
      RewardAmount = t.RewardAmount,
      RewardPoints = t.RewardPoints,
      Recurrence = t.Recurrence.ToString()
    }).ToList());
  }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateTemplate(Guid id, [FromBody] UpdateChoreTemplateRequest request)
    {
        if (string.IsNullOrEmpty(request.Title))
            return BadRequest(new { error = "Title is required" });

        var template = await service.UpdateAsync(id, request);
        if (template == null)
            return NotFound();

        return Ok(new ChoreTemplateDto
        {
            Id = template.Id,
            Title = template.Title,
            Description = template.Description,
            RewardAmount = template.RewardAmount,
            RewardPoints = template.RewardPoints,
            Recurrence = template.Recurrence.ToString()
        });
    }
}
