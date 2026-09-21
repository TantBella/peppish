using API_Peppish.Data;
using API_Peppish.DTOs;
using API_Peppish.Entities;
using API_Peppish.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API_Peppish.Controllers;

[ApiController]
[Route("api/chore-templates")]
[Authorize]
public class ChoreTemplatesController(
    IChoreTemplateService service,
    AppDbContext dbContext) : ControllerBase
{
    [HttpPost]
    public async Task<ActionResult<ChoreTemplateDto>> CreateTemplate([FromBody] DTOs.CreateChoreTemplateRequestDto request)
    {
        if (string.IsNullOrWhiteSpace(request.Title))
            return BadRequest(new { error = "Title is required" });

        if (request.RewardValue <= 0)
            return BadRequest(new { error = "RewardValue is required" });

        if (string.IsNullOrWhiteSpace(request.RewardType))
            return BadRequest(new { error = "RewardType is required" });

        if (!Enum.TryParse<RewardType>(
                request.RewardType,
                true,
                out _))
        {
            return BadRequest(new { error = "Invalid RewardType" });
        }

        var template = await service.CreateAsync(request);

        return CreatedAtAction(nameof(GetAllTemplates), new ChoreTemplateDto
        {
            Id = template.Id,
            Title = template.Title,
            Description = template.Description,
            RewardValue = template.RewardValue,
            RewardType = template.RewardType.ToString(),
            Recurrence = template.Recurrence.ToString()
        });
    }

    [HttpGet]
    public async Task<ActionResult<List<ChoreTemplateDto>>> GetAllTemplates()
    {
        var templates = await service.GetAllAsync();
        var householdId = templates.FirstOrDefault()?.HouseholdId;
        var assignments = householdId == null
            ? []
            : await dbContext.ChoreAssignments
                .Where(a => a.HouseholdId == householdId)
                .ToListAsync();

        return Ok(templates.Select(t =>
        {
            var availableAssignment = assignments.FirstOrDefault(a =>
                a.ChoreTemplateId == t.Id &&
                string.IsNullOrEmpty(a.AssignedToUserId));

            return new ChoreTemplateDto
            {
                Id = t.Id,
                Title = t.Title,
                Description = t.Description,
                RewardValue = t.RewardValue,
                RewardType = t.RewardType.ToString(),
                Recurrence = t.Recurrence.ToString(),
                IsAvailable = availableAssignment != null,
                AvailableAssignmentId = availableAssignment?.Id
            };
        }).ToList());
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateTemplate(Guid id, [FromBody] UpdateChoreTemplateRequestDto request)
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
            RewardValue = template.RewardValue,
            RewardType = template.RewardType.ToString(),
            Recurrence = template.Recurrence.ToString()
        });
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteTemplate(Guid id)
    {
        var deleted = await service.DeleteAsync(id);
        return deleted ? NoContent() : NotFound();
    }
}
