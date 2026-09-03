using API_Peppish.DTOs;
using API_Peppish.Entities;
using API_Peppish.Services;
using global::API_Peppish.DTOs;
using global::API_Peppish.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace API_Peppish.Controllers
{

    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class JoinCodeController(
        IJoinCodeService joinCodeService,
        UserManager<ApplicationUser> userManager) : ControllerBase
    {
        [HttpPost]
        [Authorize(Roles = "ADULT")]
        public async Task<ActionResult<JoinCodeDto>> Create(
            CancellationToken cancellationToken)
        {
            var userId = userManager.GetUserId(User);
            if (string.IsNullOrEmpty(userId))
                return Unauthorized();

            var result = await joinCodeService.CreateJoinCodeAsync(
                userId,
                cancellationToken);

            if (!result.Success)
                return BadRequest(new { error = result.Error });

            var dto = new JoinCodeDto
            {
                Code = result.Code,
                ExpiresAt = result.ExpiresAt
            };

            return Ok(dto);
        }
    }
}
