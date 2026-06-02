using API_Peppish.DTOs;
using API_Peppish.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API_Peppish.Controllers;

[ApiController]
[Route("api/notifications")]
[Authorize]
public class NotificationsController(
    INotificationService notificationService,
    IUserContextService userContextService) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<List<NotificationDto>>> GetMyNotifications()
    {
        var userId = userContextService.GetCurrentUserId();
        var list = await notificationService.GetUserNotificationsAsync(userId);
        return Ok(list);
    }

    [HttpPost]
    public async Task<ActionResult<NotificationDto>> CreateNotification([FromBody] CreateNotificationRequest request)
    {
        var dto = await notificationService.CreateNotificationAsync(request);
        return Ok(dto);
    }

    [HttpPatch("{id}/read")]
    public async Task<IActionResult> MarkRead(Guid id)
    {
        await notificationService.MarkAsReadAsync(id);
        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        await notificationService.DeleteAsync(id);
        return NoContent();
    }
}