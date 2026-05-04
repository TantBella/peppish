using API_Peppish.DTOs;
using API_Peppish.Entities;
using API_Peppish.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace API_Peppish.Controllers;

[ApiController]
[Route("api/chore-assignments")]
[Authorize]
public class ChoreAssignmentsController(
    IChoreAssignmentService service,
    UserManager<ApplicationUser> userManager) : ControllerBase
{
    [HttpPost]
    public async Task<ActionResult<ChoreAssignmentDto>> AssignChore([FromBody] DTOs.AssignChoreRequest request)
    {
        var serviceRequest = new Services.AssignChoreRequest
        {
            ChoreTemplateId = request.ChoreTemplateId,
            AssignedToUserId = request.AssignedToUserId,
            StartDate = request.StartDate
        };

        var assignment = await service.AssignAsync(serviceRequest);
        var assignedUser = await userManager.FindByIdAsync(assignment.AssignedToUserId);

        return CreatedAtAction(nameof(AssignChore), new ChoreAssignmentDto
        {
            Id = assignment.Id,
            ChoreTemplateId = assignment.ChoreTemplateId,
            AssignedToUserId = assignment.AssignedToUserId,
            AssignedToUserName = assignedUser?.DisplayName ?? string.Empty,
            StartDate = assignment.StartDate
        });
    }
}
