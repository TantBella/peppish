using API_Peppish.DTOs;
using API_Peppish.Entities;
using API_Peppish.Repositories;
using API_Peppish.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API_Peppish.Controllers;

[ApiController]
[Route("api/households")]
[Authorize]
public class HouseholdsController(
    IHouseholdRepository householdRepository,
    UserManager<ApplicationUser> userManager,
    IUserContextService userContextService,
    IHouseholdJoinRequestService joinRequestService) : ControllerBase
{
    [HttpGet("{id}")]
    public async Task<ActionResult<HouseholdDto>> GetHousehold(Guid id)
    {
        var currentHouseholdId = userContextService.GetCurrentHouseholdId();

        // Ensure user can only access their own household
        if (id != currentHouseholdId)
            return Forbid();

        var household = await householdRepository.GetByIdAsync(id);
        if (household == null)
            return NotFound(new { error = "Inget hushåll med det namnet finns" });

        // Get all users in this household
        var users = await userManager.Users
            .Where(u => u.HouseholdId == id)
            .Select(u => new UserDto
            {
                Id = u.Id,
                Name = u.DisplayName,
                Email = u.Email ?? string.Empty,
                Role = string.Empty, 
                HouseholdId = u.HouseholdId
            })
            .ToListAsync();

        foreach (var user in users)
        {
            var appUser = await userManager.FindByIdAsync(user.Id);
            if (appUser != null)
            {
                var roles = await userManager.GetRolesAsync(appUser);
                user.Role = roles.FirstOrDefault() ?? "Adult";
            }
        }

        var dto = new HouseholdDto
        {
            Id = household.Id,
            Name = household.Name,
            Users = users
        };

        return Ok(dto);
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
            message = "Din förfrågan om att gå med i hushållet har skickats."
        });
    }

    [HttpGet("join-requests")]
    public async Task<ActionResult<List<HouseholdJoinRequestDto>>> GetPendingJoinRequests(
    CancellationToken cancellationToken)
    {
        var requests = await joinRequestService.GetPendingRequestsAsync(
            cancellationToken);

        return Ok(requests);
    }
}
