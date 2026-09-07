using API_Peppish.DTOs;
using API_Peppish.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API_Peppish.Controllers;

[ApiController]
[Route("api/households")]
[Authorize]
public class HouseholdsController(
    IHouseholdService householdService,
    IUserContextService userContextService,
    IHouseholdJoinRequestService joinRequestService) : ControllerBase
{
    [HttpGet("{id}")]
    public async Task<ActionResult<HouseholdDto>> GetHousehold(
        Guid id,
        CancellationToken cancellationToken)
    {
        try
        {
            var household =
                await householdService.GetHouseholdAsync(
                    id,
                    cancellationToken);

            if (household == null)
            {
                return NotFound(
                    new { error = "Inget hushåll med det id:t finns." });
            }

            return Ok(household);
        }
        catch (UnauthorizedAccessException)
        {
            return Forbid();
        }
    }

    [HttpPost("join")]
    public async Task<IActionResult> JoinHousehold(
        CreateHouseholdJoinRequestDto dto,
        CancellationToken cancellationToken)
    {
        var userId = userContextService.GetCurrentUserId();

        await joinRequestService.CreateJoinRequestAsync(
            userId,
            dto,
            cancellationToken);

        return Ok(new
        {
            message =
                "Din förfrågan om att gå med i hushållet har skickats."
        });
    }

    [HttpGet("join-requests")]
    public async Task<ActionResult<List<HouseholdJoinRequestDto>>>
        GetPendingJoinRequests(
            CancellationToken cancellationToken)
    {
        var requests =
            await joinRequestService.GetPendingRequestsAsync(
                cancellationToken);

        return Ok(requests);
    }

    [HttpPost("join-requests/{requestId}/approve")]
    public async Task<IActionResult> ApproveJoinRequest(
        Guid requestId,
        CancellationToken cancellationToken)
    {
        await joinRequestService.ApproveJoinRequestAsync(
            requestId,
            cancellationToken);

        return Ok(new
        {
            message = "Förfrågan har godkänts."
        });
    }

    [HttpPost("join-requests/{requestId}/reject")]
    public async Task<IActionResult> RejectJoinRequest(
        Guid requestId,
        CancellationToken cancellationToken)
    {
        await joinRequestService.RejectJoinRequestAsync(
            requestId,
            cancellationToken);

        return Ok(new
        {
            message = "Förfrågan har nekats."
        });
    }
}

