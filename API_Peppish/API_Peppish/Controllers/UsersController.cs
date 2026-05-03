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
    IProgressService progressService) : ControllerBase
{
    [HttpGet("me")]
    public async Task<ActionResult<UserDto>> GetCurrentUser()
    {
        var userId = userContextService.GetCurrentUserId();
        var user = await userManager.FindByIdAsync(userId);
        
        if (user == null)
            return NotFound(new { error = "User not found" });

        var roles = await userManager.GetRolesAsync(user);
        return Ok(new UserDto
        {
            Id = user.Id,
            Name = user.DisplayName,
            Email = user.Email ?? string.Empty,
            Role = roles.FirstOrDefault() ?? "Child",
            HouseholdId = user.HouseholdId
        });
    }

    [HttpGet("{userId}/rewards")]
    public async Task<ActionResult<List<RewardDto>>> GetUserRewards(string userId)
    {
        var rewards = await rewardService.GetUserRewardsAsync(userId);
        return Ok(rewards);
    }

    [HttpGet("{userId}/balance")]
    public async Task<ActionResult<BalanceDto>> GetUserBalance(string userId)
    {
        var balance = await rewardService.GetUserBalanceAsync(userId);
        return Ok(new BalanceDto { Balance = balance });
    }

    [HttpGet("{userId}/progress")]
    public async Task<ActionResult<ProgressDto>> GetUserProgress(string userId)
    {
        var progress = await progressService.GetUserProgressAsync(userId);
        return Ok(progress);
    }
}
