using API_Peppish.DTOs;
using API_Peppish.Entities;
using API_Peppish.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace API_Peppish.Controllers;

[ApiController]
[Route("api/users")]
[Authorize]
public class UsersController(
    IUserContextService userContextService,
    UserManager<ApplicationUser> userManager,
    IRewardService rewardService,
    IProgressService progressService,
    IChoreAssignmentService choreAssignmentService,
    INotificationService notificationService) : ControllerBase
{
  [HttpGet("me")]
  public async Task<ActionResult<UserDto>> GetCurrentUser()
  {
    var userId = userContextService.GetCurrentUserId();
    var user = await userManager.FindByIdAsync(userId);

    if (user == null)
      return NotFound(new { error = "Användare hittas ej" });

    var roles = await userManager.GetRolesAsync(user);
    return Ok(new UserDto
    {
      Id = user.Id,
      Name = user.DisplayName,
      Email = user.Email ?? string.Empty,
      Role = roles.FirstOrDefault() ?? "ADULT",
      HouseholdId = user.HouseholdId
    });
  }

  [HttpGet("{userId}/assignments")]
  public async Task<ActionResult<List<ChoreAssignmentDto>>> GetUserAssignments(string userId)
  {
    var assignments = await choreAssignmentService.GetUserAssignmentsAsync(userId);
    var dtos = new List<ChoreAssignmentDto>();

   foreach (var assignment in assignments)
{
    var user = assignment.AssignedToUserId == null
        ? null
        : await userManager.FindByIdAsync(assignment.AssignedToUserId);

    dtos.Add(new ChoreAssignmentDto
    {
        Id = assignment.Id,
        ChoreTemplateId = assignment.ChoreTemplateId,
        AssignedToUserId = assignment.AssignedToUserId,
        AssignedToUserName = user?.DisplayName ?? string.Empty,
        StartDate = assignment.StartDate,
        DueDate = assignment.DueDate
    });
}

    return Ok(dtos);
  }



  [HttpGet("{userId}/progress")]
  public async Task<ActionResult<ProgressDto>> GetUserProgress(string userId)
  {
    var progress = await progressService.GetUserProgressAsync(userId);
    return Ok(progress);
  }

  [HttpGet("{userId}/notifications")]
  public async Task<ActionResult<List<NotificationDto>>> GetUserNotifications(string userId)
  {
    var list = await notificationService.GetUserNotificationsAsync(userId);
    return Ok(list);
  }
}
