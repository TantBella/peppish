using API_Peppish.DTOs;
using API_Peppish.Entities;
using API_Peppish.Repositories;
using Microsoft.AspNetCore.Identity;

namespace API_Peppish.Services
{
    public interface IHouseholdService
    {
        Task<HouseholdDto?> GetHouseholdAsync(
            Guid householdId,
            CancellationToken cancellationToken = default);

        Task<List<HouseholdDto>> GetAllHouseholdsAsync(
            CancellationToken cancellationToken = default);

        Task<HouseholdDto?> UpdateHouseholdAsync(
            Guid householdId,
            UpdateHouseholdDto dto,
            CancellationToken cancellationToken = default);
    }

    public class HouseholdService(
        IHouseholdRepository householdRepository,
        UserManager<ApplicationUser> userManager,
        IUserContextService userContextService) : IHouseholdService
    {
        public async Task<HouseholdDto?> GetHouseholdAsync(
            Guid householdId,
            CancellationToken cancellationToken = default)
        {
            var currentHouseholdId =
                userContextService.GetCurrentHouseholdId();

            if (householdId != currentHouseholdId)
            {
                throw new UnauthorizedAccessException(
                    "Du har inte behörighet att komma åt detta hushåll.");
            }

            var household =
                await householdRepository.GetByIdAsync(
                    householdId,
                    cancellationToken);

            if (household == null)
            {
                return null;
            }

            return await BuildHouseholdDtoAsync(
                household,
                cancellationToken);
        }

        public async Task<List<HouseholdDto>> GetAllHouseholdsAsync(
            CancellationToken cancellationToken = default)
        {
            var households =
                await householdRepository.GetAllAsync(
                    cancellationToken);

            var result = new List<HouseholdDto>();

            foreach (var household in households)
            {
                result.Add(
                    await BuildHouseholdDtoAsync(
                        household,
                        cancellationToken));
            }

            return result;
        }

        public async Task<HouseholdDto?> UpdateHouseholdAsync(
            Guid householdId,
            UpdateHouseholdDto dto,
            CancellationToken cancellationToken = default)
        {
            var household =
                await householdRepository.GetByIdAsync(
                    householdId,
                    cancellationToken);

            if (household == null)
            {
                return null;
            }

            if (string.IsNullOrWhiteSpace(dto.Name))
            {
                throw new InvalidOperationException(
                    "Hushållets namn får inte vara tomt.");
            }

            household.Name = dto.Name.Trim();

            await householdRepository.SaveChangesAsync(
                cancellationToken);

            return await BuildHouseholdDtoAsync(
                household,
                cancellationToken);
        }

        private async Task<HouseholdDto> BuildHouseholdDtoAsync(
            Household household,
            CancellationToken cancellationToken)
        {
            var users = userManager.Users
                .Where(u => u.HouseholdId == household.Id)
                .ToList();

            var userDtos = new List<UserDto>();

            foreach (var user in users)
            {
                var roles = await userManager.GetRolesAsync(user);

                userDtos.Add(new UserDto
                {
                    Id = user.Id,
                    Name = user.DisplayName,
                    Email = user.Email ?? string.Empty,
                    Role = roles.FirstOrDefault() ?? "ADULT",
                    HouseholdId = user.HouseholdId
                });
            }

            return new HouseholdDto
            {
                Id = household.Id,
                Name = household.Name,
                Users = userDtos
            };
        }
    }
}
