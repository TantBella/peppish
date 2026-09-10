
using API_Peppish.DTOs;
using API_Peppish.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace API_Peppish.Controllers
{

  [ApiController]
  [Route("api/progress")]
  [Authorize]
  public class ProgressController(
      IProgressService progressService) : ControllerBase
  {
    [HttpGet]
    public async Task<ActionResult<ProgressDto>> GetProgress(
        CancellationToken cancellationToken)
    {
      var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

      if (string.IsNullOrEmpty(userId))
        return Unauthorized();

      var progress = await progressService.GetUserProgressAsync(
          userId,
          cancellationToken);

      return Ok(progress);
    }
  }
}
