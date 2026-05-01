using API_Peppish.DTOs;
using API_Peppish.Entities;
using API_Peppish.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace API_Peppish.Controllers;

[ApiController]
[Route("api/chores")]
[Authorize]
public class ChoreInstancesController(
    IChoreInstanceService service,
    UserManager<ApplicationUser> userManager,
    IChoreTemplateService templateService) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<List<ChoreInstanceDto>>> GetChores([FromQuery] DateTime? from, [FromQuery] DateTime? to)
    {
        var fromDate = from?.ToUniversalTime() ?? DateTime.UtcNow.AddDays(-7);
        var toDate = to?.ToUniversalTime() ?? DateTime.UtcNow.AddDays(7);

        var instances = await service.GetByDateRangeAsync(fromDate, toDate);
        var dtos = new List<ChoreInstanceDto>();

        foreach (var instance in instances)
        {
            var assignment = await service.GetByIdAsync(instance.Id);
            if (assignment == null) continue;

            var user = await userManager.FindByIdAsync(instance.Id.ToString());
            var template = await templateService.GetByIdAsync(instance.Id);

            dtos.Add(new ChoreInstanceDto
            {
                Id = instance.Id,
                Title = template?.Title ?? string.Empty,
                DueDate = instance.DueDate,
                Status = instance.Status.ToString(),
                AssignedToUserId = string.Empty, // Need to get from assignment
                AssignedToUserName = user?.DisplayName ?? string.Empty,
                RewardAmount = template?.RewardAmount ?? 0
            });
        }

        return Ok(dtos);
    }

    [HttpPost("{id}/complete")]
    public async Task<ActionResult<ChoreInstanceDto>> CompleteChore(Guid id)
    {
        var instance = await service.CompleteAsync(id);
        return Ok(new { id = instance.Id, status = instance.Status.ToString() });
    }

    [HttpPost("{id}/approve")]
    public async Task<ActionResult<ChoreInstanceDto>> ApproveChore(Guid id)
    {
        var instance = await service.ApproveAsync(id);
        return Ok(new { id = instance.Id, status = instance.Status.ToString() });
    }
}
