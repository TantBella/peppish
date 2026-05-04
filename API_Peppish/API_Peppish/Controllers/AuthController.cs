using API_Peppish.DTOs;
using API_Peppish.Services;
using Microsoft.AspNetCore.Mvc;

namespace API_Peppish.Controllers;

[ApiController]
[Route("api/auth")]
public class AuthController(
    IAuthService authService) : ControllerBase
{
    [HttpPost("register")]
    public async Task<ActionResult<RegisterResponse>> Register([FromBody] RegisterRequest request)
    {
        var (success, userId, token, error) = await authService.RegisterAsync(
            request.Name, request.Email, request.Password, request.HouseholdName);

        if (!success)
            return BadRequest(new { error });

        return Ok(new RegisterResponse { UserId = userId, Token = token });
    }

    [HttpPost("login")]
    public async Task<ActionResult<LoginResponse>> Login([FromBody] LoginRequest request)
    {
        var (success, token, error) = await authService.LoginAsync(request.Email, request.Password);

        if (!success)
            return Unauthorized(new { error });

        return Ok(new LoginResponse { Token = token });
    }
}
