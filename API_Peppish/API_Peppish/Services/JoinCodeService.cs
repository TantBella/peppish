using API_Peppish.Entities;
using API_Peppish.Repositories;
using System.Security.Cryptography;

namespace API_Peppish.Services
{
    public interface IJoinCodeService
    {
        Task<(bool Success, string Code, DateTime ExpiresAt, string Error)> CreateJoinCodeAsync(
     string userId,
     CancellationToken cancellationToken = default);
    }

    public class JoinCodeService(
        IJoinCodeRepository joinCodeRepository,
        IUserContextService userContextService) : IJoinCodeService
    {
        public async Task<(bool Success, string Code, DateTime ExpiresAt, string Error)> CreateJoinCodeAsync(
            string userId,
            CancellationToken cancellationToken = default)
        {
            var householdId = userContextService.GetCurrentHouseholdId();
            if (householdId == Guid.Empty)
            {
                return (false, string.Empty, default, "Du tillhör inget hushåll.");
            }

            var code = GenerateCode();
            while (await joinCodeRepository.GetByCodeAsync(code, cancellationToken) != null)
            {
                code = GenerateCode();
            }

            var createdAt = DateTime.UtcNow;
            var expiresAt = createdAt.AddMinutes(30);

            var joinCode = new JoinCode
            {
                Code = code,
                HouseholdId = householdId,
                CreatedByUserId = userId,
                CreatedAt = createdAt,
                ExpiresAt = expiresAt,
                IsUsed = false
            };

            await joinCodeRepository.CreateAsync(joinCode, cancellationToken);
            await joinCodeRepository.SaveChangesAsync(cancellationToken);
            Console.WriteLine($"CreatedAt: {createdAt:O}");
            Console.WriteLine($"ExpiresAt: {expiresAt:O}");
            return (true, code, expiresAt, string.Empty);
        }

        private static string GenerateCode()
        {
            const string characters = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
            return RandomNumberGenerator.GetString(characters, 6);
        }
    }
}

