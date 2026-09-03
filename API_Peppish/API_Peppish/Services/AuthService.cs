using API_Peppish.DTOs;
using API_Peppish.Entities;
using API_Peppish.Repositories;
using Microsoft.AspNetCore.Identity;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace API_Peppish.Services;

public interface IAuthService
{
    Task<(bool Success, string UserId, string Token, string Error)> RegisterAsync(
        RegisterDto dto,
        CancellationToken cancellationToken = default);

    Task<(bool Success, string Token, string Error)> LoginAsync(
        string email,
        string password,
        CancellationToken cancellationToken = default);
}

public class AuthService(
    UserManager<ApplicationUser> userManager,
    IHouseholdRepository householdRepository,
    IConfiguration configuration,
    ILogger<AuthService> logger) : IAuthService
{
    public async Task<(bool Success, string UserId, string Token, string Error)> RegisterAsync(
        RegisterDto dto,
        CancellationToken cancellationToken = default)
    {
        // 1. Kontrollera att alla fält är ifyllda
        if (string.IsNullOrWhiteSpace(dto.Username) ||
            string.IsNullOrWhiteSpace(dto.Email) ||
            string.IsNullOrWhiteSpace(dto.Password) ||
            string.IsNullOrWhiteSpace(dto.HouseholdName))
        {
            return (
                false,
                string.Empty,
                string.Empty,
                "Username, email, password and household name are required");
        }

        // 2. Kontrollera att email inte redan används
        var existingUser = await userManager.FindByEmailAsync(dto.Email);

        if (existingUser != null)
        {
            return (
                false,
                string.Empty,
                string.Empty,
                "User with this email already exists");
        }

        // 3. Kontrollera att hushållet inte redan finns
        var existingHousehold = await householdRepository.GetByNameAsync(
            dto.HouseholdName,
            cancellationToken);

        if (existingHousehold != null)
        {
            return (
                false,
                string.Empty,
                string.Empty,
                "A household with this name already exists. You need an invitation to join an existing household.");
        }

        // 4. Skapa det nya hushållet
        var household = new Household
        {
            Name = dto.HouseholdName
        };

        await householdRepository.CreateAsync(
            household,
            cancellationToken);

        await householdRepository.SaveChangesAsync(
            cancellationToken);

        // 5. Skapa användaren
        var user = new ApplicationUser
        {
            UserName = dto.Username,
            Email = dto.Email,
            DisplayName = dto.Username,
            HouseholdId = household.Id
        };

        var result = await userManager.CreateAsync(
            user,
            dto.Password);

        if (!result.Succeeded)
        {
            var errors = string.Join(
                ", ",
                result.Errors.Select(e => e.Description));

            logger.LogWarning(
                "User registration failed for {email}: {errors}",
                dto.Email,
                errors);

            return (
                false,
                string.Empty,
                string.Empty,
                errors);
        }

        // 6. Den som skapar ett nytt hushåll blir vuxen
        const string role = "ADULT";

        var roleResult = await userManager.AddToRoleAsync(
            user,
            role);

        if (!roleResult.Succeeded)
        {
            var errors = string.Join(
                ", ",
                roleResult.Errors.Select(e => e.Description));

            logger.LogWarning(
                "Adding role failed for {email}: {errors}",
                dto.Email,
                errors);

            return (
                false,
                string.Empty,
                string.Empty,
                errors);
        }

        // 7. Skapa JWT-token
        var token = GenerateJwtToken(
            user,
            role);

        logger.LogInformation(
            "User {email} registered successfully",
            dto.Email);

        return (
            true,
            user.Id,
            token,
            string.Empty);
    }

    public async Task<(bool Success, string Token, string Error)> LoginAsync(
        string email,
        string password,
        CancellationToken cancellationToken = default)
    {
        var user = await userManager.FindByEmailAsync(email);

        if (user == null ||
            !await userManager.CheckPasswordAsync(user, password))
        {
            logger.LogWarning(
                "Login failed for {email}",
                email);

            return (
                false,
                string.Empty,
                "Invalid email or password");
        }

        var roles = await userManager.GetRolesAsync(user);

        var role = roles.FirstOrDefault() ?? "CHILD";

        var token = GenerateJwtToken(
            user,
            role);

        logger.LogInformation(
            "User {email} logged in successfully",
            email);

        return (
            true,
            token,
            string.Empty);
    }

    private string GenerateJwtToken(
        ApplicationUser user,
        string role)
    {
        var jwtKey = configuration["Jwt:Key"];
        var jwtIssuer = configuration["Jwt:Issuer"];
        var jwtAudience = configuration["Jwt:Audience"];

        if (string.IsNullOrWhiteSpace(jwtKey))
            throw new InvalidOperationException(
                "Jwt:Key saknas i AuthService");

        if (string.IsNullOrWhiteSpace(jwtIssuer))
            throw new InvalidOperationException(
                "Jwt:Issuer saknas i AuthService");

        if (string.IsNullOrWhiteSpace(jwtAudience))
            throw new InvalidOperationException(
                "Jwt:Audience saknas i AuthService");

        var key = Encoding.UTF8.GetBytes(jwtKey);

        var handler = new JwtSecurityTokenHandler();

        var tokenDescriptor = new SecurityTokenDescriptor
        {
            Subject = new ClaimsIdentity(new[]
            {
                new Claim(
                    ClaimTypes.NameIdentifier,
                    user.Id),

                new Claim(
                    ClaimTypes.Email,
                    user.Email ?? string.Empty),

                new Claim(
                    ClaimTypes.Name,
                    user.DisplayName ?? string.Empty),

                new Claim(
                    ClaimTypes.Role,
                    role)
            }),

            Expires = DateTime.UtcNow.AddDays(7),

            Issuer = jwtIssuer,

            Audience = jwtAudience,

            SigningCredentials = new SigningCredentials(
                new SymmetricSecurityKey(key),
                SecurityAlgorithms.HmacSha256Signature)
        };

        var token = handler.CreateToken(
            tokenDescriptor);

        return handler.WriteToken(token);
    }
}