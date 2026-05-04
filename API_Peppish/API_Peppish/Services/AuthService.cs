using API_Peppish.Entities;
using API_Peppish.Repositories;
using Microsoft.AspNetCore.Identity;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.IdentityModel.Tokens;

namespace API_Peppish.Services;

public interface IAuthService
{
    Task<(bool Success, string UserId, string Token, string Error)> RegisterAsync(
        string name, string email, string password, string householdName, CancellationToken cancellationToken = default);
    
    Task<(bool Success, string Token, string Error)> LoginAsync(
        string email, string password, CancellationToken cancellationToken = default);
}

public class AuthService(
    UserManager<ApplicationUser> userManager,
    IHouseholdRepository householdRepository,
    IConfiguration configuration,
    ILogger<AuthService> logger) : IAuthService
{
    public async Task<(bool Success, string UserId, string Token, string Error)> RegisterAsync(
        string name, string email, string password, string householdName, CancellationToken cancellationToken = default)
    {
        // Validate input
        if (string.IsNullOrEmpty(name) || string.IsNullOrEmpty(email) || string.IsNullOrEmpty(password))
            return (false, string.Empty, string.Empty, "Name, email, and password are required");

        // Check if user already exists
        var existingUser = await userManager.FindByEmailAsync(email);
        if (existingUser != null)
            return (false, string.Empty, string.Empty, "User with this email already exists");

        // Create household
        var household = new Household { Name = householdName };
        await householdRepository.CreateAsync(household, cancellationToken);
        await householdRepository.SaveChangesAsync(cancellationToken);

        // Create user
        var user = new ApplicationUser
        {
            UserName = email,
            Email = email,
            DisplayName = name,
            HouseholdId = household.Id
        };

        var result = await userManager.CreateAsync(user, password);
        if (!result.Succeeded)
        {
            var errors = string.Join(", ", result.Errors.Select(e => e.Description));
            logger.LogWarning("User registration failed for {email}: {errors}", email, errors);
            return (false, string.Empty, string.Empty, errors);
        }

        // Assign Adult role to first user
        await userManager.AddToRoleAsync(user, "Adult");

        var token = GenerateJwtToken(user, "Adult");
        logger.LogInformation("User {email} registered successfully", email);

        return (true, user.Id, token, string.Empty);
    }

    public async Task<(bool Success, string Token, string Error)> LoginAsync(
        string email, string password, CancellationToken cancellationToken = default)
    {
        var user = await userManager.FindByEmailAsync(email);
        if (user == null || !await userManager.CheckPasswordAsync(user, password))
        {
            logger.LogWarning("Login failed for {email}", email);
            return (false, string.Empty, "Invalid email or password");
        }

        var roles = await userManager.GetRolesAsync(user);
        var role = roles.FirstOrDefault() ?? "Child";

        var token = GenerateJwtToken(user, role);
        logger.LogInformation("User {email} logged in successfully", email);

        return (true, token, string.Empty);
    }

    private string GenerateJwtToken(ApplicationUser user, string role)
    {
        var key = Encoding.ASCII.GetBytes(configuration["Jwt:Key"]!);
        var handler = new JwtSecurityTokenHandler();

        var tokenDescriptor = new SecurityTokenDescriptor
        {
            Subject = new ClaimsIdentity(new[]
            {
                new Claim(ClaimTypes.NameIdentifier, user.Id),
                new Claim(ClaimTypes.Email, user.Email ?? string.Empty),
                new Claim(ClaimTypes.Name, user.DisplayName),
                new Claim(ClaimTypes.Role, role)
            }),
            Expires = DateTime.UtcNow.AddDays(7),
            Issuer = configuration["Jwt:Issuer"],
            Audience = configuration["Jwt:Audience"],
            SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
        };

        var token = handler.CreateToken(tokenDescriptor);
        return handler.WriteToken(token);
    }
}
