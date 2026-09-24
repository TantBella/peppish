using API_Peppish.DTOs;
using API_Peppish.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API_Peppish.Controllers;

[ApiController]
[Route("api/chores")]
[Authorize]
public class ChoreInstancesController(
    IChoreInstanceService service,
    ILogger<ChoreInstancesController> logger) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<List<ChoreInstanceDto>>> GetChores([FromQuery] DateTime? from, [FromQuery] DateTime? to)
    {
        var fromDate = from?.ToUniversalTime() ?? DateTime.UtcNow.AddDays(-7);
        var toDate = to?.ToUniversalTime() ?? DateTime.UtcNow.AddDays(7);

        var dtos = await service.GetByDateRangeAsDto(fromDate, toDate);
        return Ok(dtos);
    }

    [HttpPost("{id}/complete")]
    public async Task<ActionResult<ChoreInstanceDto>> CompleteChore(Guid id)
    {
        try
        {
            var instance = await service.CompleteAsync(id);
            return Ok(new { id = instance.Id, status = instance.Status.ToString() });
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
        catch (UnauthorizedAccessException ex)
        {
            return StatusCode(StatusCodes.Status403Forbidden, new { message = ex.Message });
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Kunde inte slutföra questinstans {ChoreInstanceId}", id);
            return Problem("Ett internt fel uppstod när questen skulle slutföras.");
        }
    }

    [HttpPost("{id}/approve")]
    public async Task<ActionResult<ChoreInstanceDto>> ApproveChore(Guid id)
    {
        var instance = await service.ApproveAsync(id);
        return Ok(new { id = instance.Id, status = instance.Status.ToString() });
    }
}
