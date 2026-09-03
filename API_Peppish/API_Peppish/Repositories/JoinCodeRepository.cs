using API_Peppish.Data;
using API_Peppish.Entities;
using Microsoft.EntityFrameworkCore;

namespace API_Peppish.Repositories
{
    public interface IJoinCodeRepository
    {
        Task<JoinCode?> GetByCodeAsync(
            string code,
            CancellationToken cancellationToken = default);

        Task<JoinCode> CreateAsync(
            JoinCode joinCode,
            CancellationToken cancellationToken = default);

        Task SaveChangesAsync(
            CancellationToken cancellationToken = default);
    }

    public class JoinCodeRepository(AppDbContext context) : IJoinCodeRepository
    {
        public async Task<JoinCode?> GetByCodeAsync(
            string code,
            CancellationToken cancellationToken = default)
        {
            return await context.JoinCodes
                .FirstOrDefaultAsync(
                    j => j.Code == code,
                    cancellationToken);
        }

        public async Task<JoinCode> CreateAsync(
            JoinCode joinCode,
            CancellationToken cancellationToken = default)
        {
            await context.JoinCodes.AddAsync(
                joinCode,
                cancellationToken);

            return joinCode;
        }

        public async Task SaveChangesAsync(
            CancellationToken cancellationToken = default)
        {
            await context.SaveChangesAsync(cancellationToken);
        }
    }
}
