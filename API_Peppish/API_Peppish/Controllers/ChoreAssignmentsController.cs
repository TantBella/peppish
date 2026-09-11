using API_Peppish.DTOs;
using API_Peppish.Entities;
using API_Peppish.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace API_Peppish.Controllers
{
    [ApiController]
    [Route("api/chore-assignments")]
    [Authorize]
    public class ChoreAssignmentsController(
        IChoreAssignmentService service,
        UserManager<ApplicationUser> userManager) : ControllerBase
    {
    [HttpPost]
    public async Task<ActionResult<ChoreAssignmentDto>> AssignChore(
        [FromBody] AssignChoreRequestDto request)
    {
      var assignment = await service.AssignAsync(request);

      var assignedUser = assignment.AssignedToUserId == null
          ? null
          : await userManager.FindByIdAsync(
              assignment.AssignedToUserId);

      return Created("", new ChoreAssignmentDto
      {
        Id = assignment.Id,
        ChoreTemplateId = assignment.ChoreTemplateId,
        AssignedToUserId = assignment.AssignedToUserId,
        AssignedToUserName = assignedUser?.DisplayName ?? string.Empty,
        StartDate = assignment.StartDate,
        DueDate = assignment.DueDate
      });
    }

        [HttpGet]
public async Task<ActionResult<List<ChoreAssignmentDto>>> GetAssignments(
    CancellationToken cancellationToken)
{
    var userId = userManager.GetUserId(User);

    if (string.IsNullOrEmpty(userId))
    {
        return Unauthorized();
    }

    var assignments = await service.GetUserAssignmentsAsync(
        userId,
        cancellationToken);

    var result = new List<ChoreAssignmentDto>();

    foreach (var assignment in assignments)
    {
        var assignedUser = assignment.AssignedToUserId == null
            ? null
            : await userManager.FindByIdAsync(
                assignment.AssignedToUserId);

        result.Add(new ChoreAssignmentDto
        {
            Id = assignment.Id,
            ChoreTemplateId = assignment.ChoreTemplateId,
            AssignedToUserId = assignment.AssignedToUserId,
            AssignedToUserName = assignedUser?.DisplayName ?? string.Empty,
            StartDate = assignment.StartDate,
            DueDate = assignment.DueDate
        });
    }

    return Ok(result);
}

        [HttpPost("{assignmentId}/take")]
        public async Task<ActionResult<ChoreAssignmentDto>> TakeFreeQuest(
         Guid assignmentId)
        {
            try
            {
                var assignment = await service.TakeFreeQuestAsync(assignmentId);

                var assignedUser = assignment.AssignedToUserId == null
                    ? null
                    : await userManager.FindByIdAsync(
                        assignment.AssignedToUserId);

                return Ok(new ChoreAssignmentDto
                {
                    Id = assignment.Id,
                    ChoreTemplateId = assignment.ChoreTemplateId,
                    AssignedToUserId = assignment.AssignedToUserId,
                    AssignedToUserName = assignedUser?.DisplayName ?? string.Empty,
                    StartDate = assignment.StartDate,
                    DueDate = assignment.DueDate
                });
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }

        [HttpGet]
        public async Task<ActionResult<List<ChoreAssignmentDto>>> GetAssignments(
    CancellationToken cancellationToken)
        {
            var userId = userManager.GetUserId(User);

            if (string.IsNullOrEmpty(userId))
            {
                return Unauthorized();
            }

            var assignments = await service.GetUserAssignmentsAsync(
                userId,
                cancellationToken);

            var result = new List<ChoreAssignmentDto>();

            foreach (var assignment in assignments)
            {
                var assignedUser = assignment.AssignedToUserId == null
                    ? null
                    : await userManager.FindByIdAsync(
                        assignment.AssignedToUserId);

                result.Add(new ChoreAssignmentDto
                {
                    Id = assignment.Id,
                    ChoreTemplateId = assignment.ChoreTemplateId,
                    AssignedToUserId = assignment.AssignedToUserId,
                    AssignedToUserName = assignedUser?.DisplayName ?? string.Empty,
                    StartDate = assignment.StartDate,
                    DueDate = assignment.DueDate
                });
            }

            return Ok(result);
        }

        [HttpPost("{assignmentId}/take")]
        public async Task<ActionResult<ChoreAssignmentDto>> TakeFreeQuest(
         Guid assignmentId)
        {
            try
            {
                var assignment = await service.TakeFreeQuestAsync(assignmentId);

                var assignedUser = assignment.AssignedToUserId == null
                    ? null
                    : await userManager.FindByIdAsync(
                        assignment.AssignedToUserId);

                return Ok(new ChoreAssignmentDto
                {
                    Id = assignment.Id,
                    ChoreTemplateId = assignment.ChoreTemplateId,
                    AssignedToUserId = assignment.AssignedToUserId,
                    AssignedToUserName = assignedUser?.DisplayName ?? string.Empty,
                    StartDate = assignment.StartDate,
                    DueDate = assignment.DueDate
                });
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }
    }
}
