using API_Peppish.Data;
using API_Peppish.Entities;
using Microsoft.EntityFrameworkCore;

namespace API_Peppish.Repositories
{
    public interface IHouseholdRepository
{
    Task<Household?> GetByIdAsync(
        Guid householdId,
        CancellationToken cancellationToken = default);

    Task<List<Household>> GetAllAsync(
        CancellationToken cancellationToken = default);

    Task<List<ApplicationUser>> GetUsersAsync(
        Guid householdId,
        CancellationToken cancellationToken = default);

    Task<Household?> GetByNameAsync(
        string name,
        CancellationToken cancellationToken = default);

    Task<Household> CreateAsync(
        Household household,
        CancellationToken cancellationToken = default);

    Task SaveChangesAsync(
        CancellationToken cancellationToken = default);
}

    public class HouseholdRepository(AppDbContext context)
        : IHouseholdRepository
    {
        public async Task<Household?> GetByIdAsync(
            Guid householdId,
            CancellationToken cancellationToken = default)
        {
            return await context.Households.FindAsync(
                new object[] { householdId },
                cancellationToken: cancellationToken);
        }

    public async Task<List<Household>> GetAllAsync(
        CancellationToken cancellationToken = default)
    {
      return await context.Households
          .ToListAsync(cancellationToken);
    }

        public async Task<List<ApplicationUser>> GetUsersAsync(
    Guid householdId,
    CancellationToken cancellationToken = default)
{
    return await context.Users
        .Where(u => u.HouseholdId == householdId)
        .ToListAsync(cancellationToken);
}

        public async Task<Household?> GetByNameAsync(
            string name,
            CancellationToken cancellationToken = default)
        {
            return await context.Households
                .FirstOrDefaultAsync(
                    h => h.Name == name,
                    cancellationToken);
        }

        public async Task<Household> CreateAsync(
            Household household,
            CancellationToken cancellationToken = default)
        {
            await context.Households.AddAsync(
                household,
                cancellationToken);

            return household;
        }

        public async Task SaveChangesAsync(
            CancellationToken cancellationToken = default)
        {
            await context.SaveChangesAsync(cancellationToken);
        }
    }
}
