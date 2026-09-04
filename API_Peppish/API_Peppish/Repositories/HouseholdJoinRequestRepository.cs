using API_Peppish.Data;
using API_Peppish.Entities;
using Microsoft.EntityFrameworkCore;

namespace API_Peppish.Repositories
{
    public interface IHouseholdJoinRequestRepository
    {
        Task<HouseholdJoinRequest?> GetPendingRequestAsync(
            string userId,
            Guid householdId,
            CancellationToken cancellationToken = default);

        Task<List<HouseholdJoinRequest>> GetPendingRequestsByHouseholdAsync(
            Guid householdId,
            CancellationToken cancellationToken = default);

        Task AddAsync(
            HouseholdJoinRequest request,
            CancellationToken cancellationToken = default);

        Task SaveChangesAsync(
            CancellationToken cancellationToken = default);
    }

    public class HouseholdJoinRequestRepository : IHouseholdJoinRequestRepository
    {
        private readonly AppDbContext _context;

        public HouseholdJoinRequestRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<HouseholdJoinRequest?> GetPendingRequestAsync(
            string userId,
            Guid householdId,
            CancellationToken cancellationToken = default)
        {
            return await _context.HouseholdJoinRequests
                .FirstOrDefaultAsync(
                    r =>
                        r.UserId == userId &&
                        r.HouseholdId == householdId &&
                        r.Status == JoinRequestStatus.Pending,
                    cancellationToken);
        }

        public async Task<List<HouseholdJoinRequest>> GetPendingRequestsByHouseholdAsync(
             Guid householdId,
             CancellationToken cancellationToken = default)
        {
            return await _context.HouseholdJoinRequests
                .Where(r =>
                    r.HouseholdId == householdId &&
                    r.Status == JoinRequestStatus.Pending)
                .ToListAsync(cancellationToken);
        }

        public async Task AddAsync(
            HouseholdJoinRequest request,
            CancellationToken cancellationToken = default)
        {
            await _context.HouseholdJoinRequests.AddAsync(
                request,
                cancellationToken);
        }

        public async Task SaveChangesAsync(
            CancellationToken cancellationToken = default)
        {
            await _context.SaveChangesAsync(cancellationToken);
        }
    }
}
