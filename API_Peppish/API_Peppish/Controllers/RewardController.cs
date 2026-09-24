using API_Peppish.DTOs;
using API_Peppish.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API_Peppish.Controllers;

[ApiController]
[Route("api/rewards")]
[Authorize]
public class RewardController(
    IRewardService rewardService,
    IUserContextService userContextService) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<List<RewardDto>>> GetUserRewards()
    {
        var userId = userContextService.GetCurrentUserId();

        var rewards = await rewardService.GetUserRewardsAsync(userId);

        return Ok(rewards);
    }

    [HttpGet("balance")]
    public async Task<ActionResult<BalanceDto>> GetUserBalance()
    {
        var userId = userContextService.GetCurrentUserId();

        var result = await rewardService.GetUserBalanceAsync(userId);

        return Ok(new BalanceDto
        {
            UserId = userId,
            MoneyBalance = result.MoneyBalance,
            TotalXp = result.TotalXp
        });
    }
}
