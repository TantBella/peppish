using API_Peppish.DTOs;
using API_Peppish.Entities;
using API_Peppish.Repositories;

namespace API_Peppish.Services
{
    public interface IHouseholdJoinRequestService
    {
        Task CreateJoinRequestAsync(
            string userId,
            CreateHouseholdJoinRequestDto dto,
            CancellationToken cancellationToken = default);
    }

    public class HouseholdJoinRequestService(
        IHouseholdJoinRequestRepository joinRequestRepository,
        IJoinCodeRepository joinCodeRepository) : IHouseholdJoinRequestService
    {
        public async Task CreateJoinRequestAsync(
            string userId,
            CreateHouseholdJoinRequestDto dto,
            CancellationToken cancellationToken = default)
        {
            var joinCode = await joinCodeRepository.GetByCodeAsync(
                dto.JoinCode,
                cancellationToken);

            if (joinCode == null)
            {
                throw new InvalidOperationException("Ogiltig inbjudan.");
            }

            if (joinCode.ExpiresAt <= DateTime.UtcNow)
            {
                throw new InvalidOperationException("Inbjudan har gått ut.");
            }

            if (joinCode.IsUsed)
            {
                throw new InvalidOperationException("Inbjudan har redan använts.");
            }

            var existingRequest =
            await joinRequestRepository.GetPendingRequestAsync(
                 userId,
                 joinCode.HouseholdId,
                 cancellationToken);

            if (existingRequest != null)
            {
                throw new InvalidOperationException(
                    "Du har redan en väntande förfrågan till detta hushåll.");
            }

            var request = new HouseholdJoinRequest
            {
                UserId = userId,
                HouseholdId = joinCode.HouseholdId,
                JoinCodeId = joinCode.Id,
                Status = JoinRequestStatus.Pending
            };

            await joinRequestRepository.AddAsync(
                request,
                cancellationToken);

            await joinRequestRepository.SaveChangesAsync(cancellationToken);
        }
    }
}