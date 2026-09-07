using API_Peppish.DTOs;
using API_Peppish.Entities;
using API_Peppish.Repositories;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace API_Peppish.Services
{
    public interface IHouseholdService
    {
        Task<HouseholdDto?> GetHouseholdAsync(
            Guid householdId,
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

            // Användaren får bara komma åt sitt eget hushåll
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

            var users = await userManager.Users
                .Where(u => u.HouseholdId == householdId)
                .ToListAsync(cancellationToken);

            var userDtos = new List<UserDto>();

            foreach (var user in users)
            {
                var roles = await userManager.GetRolesAsync(user);

                userDtos.Add(new UserDto
                {
                    Id = user.Id,
                    Name = user.DisplayName,
                    Email = user.Email ?? string.Empty,
                    Role = roles.FirstOrDefault() ?? "Adult",
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

