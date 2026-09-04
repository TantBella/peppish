using API_Peppish.DTOs;
using API_Peppish.Entities;
using API_Peppish.Repositories;
using Microsoft.AspNetCore.Identity;

namespace API_Peppish.Services
{
    public interface IHouseholdJoinRequestService
    {
        Task CreateJoinRequestAsync(
            string userId,
            CreateHouseholdJoinRequestDto dto,
            CancellationToken cancellationToken = default);

        Task<List<HouseholdJoinRequestDto>> GetPendingRequestsAsync(
            CancellationToken cancellationToken = default);

        Task ApproveJoinRequestAsync(
            Guid requestId,
            CancellationToken cancellationToken = default);

        Task RejectJoinRequestAsync(
            Guid requestId,
            CancellationToken cancellationToken = default);
    }

    public class HouseholdJoinRequestService(
        IHouseholdJoinRequestRepository joinRequestRepository,
        IJoinCodeRepository joinCodeRepository,
        IUserContextService userContextService,
        UserManager<ApplicationUser> userManager) : IHouseholdJoinRequestService
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

        public async Task<List<HouseholdJoinRequestDto>> GetPendingRequestsAsync(
            CancellationToken cancellationToken = default)
        {
            var householdId = userContextService.GetCurrentHouseholdId();

            var requests = await joinRequestRepository
                .GetPendingRequestsByHouseholdAsync(
                    householdId,
                    cancellationToken);

            return requests.Select(request => new HouseholdJoinRequestDto
            {
                Id = request.Id,
                UserId = request.UserId,
                HouseholdId = request.HouseholdId,
                CreatedAt = request.CreatedAt,
                Status = request.Status.ToString()
            }).ToList();
        }

        public async Task ApproveJoinRequestAsync(
             Guid requestId,
             CancellationToken cancellationToken = default)
        {
            var request = await joinRequestRepository.GetByIdAsync(
                requestId,
                cancellationToken);

            if (request == null)
            {
                throw new InvalidOperationException(
                    "Förfrågan kunde inte hittas.");
            }

            var householdId = userContextService.GetCurrentHouseholdId();

            if (request.HouseholdId != householdId)
            {
                throw new UnauthorizedAccessException(
                    "Du har inte behörighet att hantera denna förfrågan.");
            }

            if (request.Status != JoinRequestStatus.Pending)
            {
                throw new InvalidOperationException(
                    "Förfrågan har redan hanterats.");
            }

            var user = await userManager.FindByIdAsync(request.UserId);

            if (user == null)
            {
                throw new InvalidOperationException(
                    "Användaren kunde inte hittas.");
            }

            user.HouseholdId = request.HouseholdId;

            request.Status = JoinRequestStatus.Approved;

            await joinRequestRepository.SaveChangesAsync(
                cancellationToken);
        }

        public async Task RejectJoinRequestAsync(
    Guid requestId,
    CancellationToken cancellationToken = default)
        {
            var request = await joinRequestRepository.GetByIdAsync(
                requestId,
                cancellationToken);

            if (request == null)
            {
                throw new InvalidOperationException(
                    "Förfrågan kunde inte hittas.");
            }

            var householdId = userContextService.GetCurrentHouseholdId();

            if (request.HouseholdId != householdId)
            {
                throw new UnauthorizedAccessException(
                    "Du har inte behörighet att hantera denna förfrågan.");
            }

            if (request.Status != JoinRequestStatus.Pending)
            {
                throw new InvalidOperationException(
                    "Förfrågan har redan hanterats.");
            }

            request.Status = JoinRequestStatus.Rejected;

            await joinRequestRepository.SaveChangesAsync(
                cancellationToken);
        }
    }
}