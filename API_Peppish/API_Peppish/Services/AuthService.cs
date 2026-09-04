using API_Peppish.DTOs;
using API_Peppish.Entities;
using API_Peppish.Repositories;
using Microsoft.AspNetCore.Identity;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace API_Peppish.Services
{
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
            if (string.IsNullOrWhiteSpace(dto.Username) ||
                string.IsNullOrWhiteSpace(dto.Email) ||
                string.IsNullOrWhiteSpace(dto.Password))
            {
                return (
                    false,
                    string.Empty,
                    string.Empty,
                    "Username, email and password are required");
            }

            // 2. Kontrollera att email inte redan används
            var existingUser = await userManager.FindByEmailAsync(dto.Email);

            if (existingUser != null)
            {
                return (
                    false,
                    string.Empty,
                    string.Empty,
                    "Det finns redan en användare med denna email");
            }

            Guid? householdId = null;

            // 3. Om HouseholdName anges skapas ett nytt hushåll
            if (!string.IsNullOrWhiteSpace(dto.HouseholdName))
            {
                var existingHousehold =
                    await householdRepository.GetByNameAsync(
                        dto.HouseholdName,
                        cancellationToken);

                if (existingHousehold != null)
                {
                    return (
                        false,
                        string.Empty,
                        string.Empty,
                        "Ett hushåll med det namnet finns redan. Du behöver en inbjudan för att gå med i ett befintligt hushåll.");
                }

                var household = new Household
                {
                    Name = dto.HouseholdName
                };

                await householdRepository.CreateAsync(
                    household,
                    cancellationToken);

                await householdRepository.SaveChangesAsync(
                    cancellationToken);

                householdId = household.Id;
            }

            var user = new ApplicationUser
            {
                UserName = dto.Username,
                Email = dto.Email,
                DisplayName = dto.Username,
                HouseholdId = householdId
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
                    "{email}s misslyckades med registrering pga: {errors}",
                    dto.Email,
                    errors);

                return (
                    false,
                    string.Empty,
                    string.Empty,
                    errors);
            }

            var role = dto.Role.ToUpperInvariant();

            if (role != "ADULT" && role != "CHILD")
            {
                return (
                    false,
                    string.Empty,
                    string.Empty,
                    "Rollen måste vara ADULT eller CHILD.");
            }

            if (!string.IsNullOrWhiteSpace(dto.HouseholdName) &&
                role != "ADULT")
            {
                return (
                    false,
                    string.Empty,
                    string.Empty,
                    "Du måste vara vuxen för att skapa ett nytt hushåll.");
            }

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

            var token = GenerateJwtToken(
                user,
                role);

            logger.LogInformation(
                "{email} är registrerad",
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
                    "{email}s inloggning misslyckades",
                    email);

                return (
                    false,
                    string.Empty,
                    "Ogiltig email eller lösenord");
            }

            var roles = await userManager.GetRolesAsync(user);

            var role = roles.FirstOrDefault() ?? "ADULT";

            var token = GenerateJwtToken(
                user,
                role);

            logger.LogInformation(
                "{email} har loggats in",
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

            var token = handler.CreateToken(tokenDescriptor);

            return handler.WriteToken(token);
        }
    }
}