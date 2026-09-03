using API_Peppish.Entities;
using API_Peppish.Repositories;
using System.Security.Cryptography;

namespace API_Peppish.Services
{
    public interface IJoinCodeService
    {
        Task<(bool Success, string Code, string Error)> CreateJoinCodeAsync(
            string userId,
            CancellationToken cancellationToken = default);
    }

    public class JoinCodeService(
        IJoinCodeRepository joinCodeRepository,
        IUserContextService userContextService) : IJoinCodeService
    {
        public async Task<(bool Success, string Code, string Error)> CreateJoinCodeAsync(
            string userId,
            CancellationToken cancellationToken = default)
        {
            var householdId = userContextService.GetCurrentHouseholdId();

            if (householdId == Guid.Empty)
            {
                return (
                    false,
                    string.Empty,
                    "Du tillhör inget hushåll.");
            }

            var code = GenerateCode();

            while (await joinCodeRepository.GetByCodeAsync(
                code,
                cancellationToken) != null)
            {
                code = GenerateCode();
            }

            var joinCode = new JoinCode
            {
                Code = code,
                HouseholdId = householdId,
                CreatedByUserId = userId,
                CreatedAt = DateTime.UtcNow,
                ExpiresAt = DateTime.UtcNow.AddMinutes(30),
                IsUsed = false
            };

            await joinCodeRepository.CreateAsync(
                joinCode,
                cancellationToken);

            await joinCodeRepository.SaveChangesAsync(
                cancellationToken);

            return (
                true,
                code,
                string.Empty);
        }

        private static string GenerateCode()
        {
            const string characters = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

            return RandomNumberGenerator.GetString(
                characters,
                6);
        }
    }
}

