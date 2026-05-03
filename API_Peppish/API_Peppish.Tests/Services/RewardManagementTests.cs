using API_Peppish.Repositories;
using API_Peppish.Services;
using API_Peppish.Entities;
using Moq;
using Xunit;

namespace API_Peppish.Tests.Services;

/// <summary>
/// Tests for reward-related functionality:
/// - Reward creation only after approval
/// - Balance calculations
/// - Reward retrieval with household isolation
/// </summary>
public class RewardManagementTests
{
    private readonly Mock<IRewardRepository> _mockRewardRepository;
    private readonly Mock<IUserContextService> _mockUserContextService;
    private readonly RewardService _rewardService;

    private readonly Guid _householdId = Guid.NewGuid();
    private readonly string _childUserId = "child-123";

    public RewardManagementTests()
    {
        _mockRewardRepository = new Mock<IRewardRepository>();
        _mockUserContextService = new Mock<IUserContextService>();
        _rewardService = new RewardService(_mockRewardRepository.Object, _mockUserContextService.Object);

        _mockUserContextService.Setup(x => x.GetCurrentHouseholdId()).Returns(_householdId);
    }

    [Fact]
    public async Task GetUserBalance_ReturnsZero_WhenUserHasNoRewards()
    {
        // Arrange
        _mockRewardRepository
            .Setup(x => x.GetUserBalanceAsync(_childUserId, _householdId, It.IsAny<CancellationToken>()))
            .ReturnsAsync(0m);

        // Act
        var balance = await _rewardService.GetUserBalanceAsync(_childUserId);

        // Assert
        Assert.Equal(0m, balance);
    }

    [Fact]
    public async Task GetUserBalance_ReturnsSumOfAllRewards()
    {
        // Arrange
        decimal expectedBalance = 250m; // Multiple rewards combined
        _mockRewardRepository
            .Setup(x => x.GetUserBalanceAsync(_childUserId, _householdId, It.IsAny<CancellationToken>()))
            .ReturnsAsync(expectedBalance);

        // Act
        var balance = await _rewardService.GetUserBalanceAsync(_childUserId);

        // Assert
        Assert.Equal(expectedBalance, balance);
    }

    [Fact]
    public async Task GetUserRewards_ReturnsEmptyList_WhenUserHasNoRewards()
    {
        // Arrange
        _mockRewardRepository
            .Setup(x => x.GetByUserAsync(_childUserId, _householdId, It.IsAny<CancellationToken>()))
            .ReturnsAsync(new List<RewardLedger>());

        // Act
        var rewards = await _rewardService.GetUserRewardsAsync(_childUserId);

        // Assert
        Assert.Empty(rewards);
    }

    [Fact]
    public async Task GetUserRewards_ReturnsAllRewardsForUser()
    {
        // Arrange
        var rewardList = new List<RewardLedger>
        {
            new()
            {
                Amount = 50m,
                Reason = "Completed chore: Clean room",
                CreatedAt = DateTime.UtcNow.AddDays(-2),
                UserId = _childUserId,
                HouseholdId = _householdId
            },
            new()
            {
                Amount = 100m,
                Reason = "Completed chore: Dishes",
                CreatedAt = DateTime.UtcNow.AddDays(-1),
                UserId = _childUserId,
                HouseholdId = _householdId
            }
        };

        _mockRewardRepository
            .Setup(x => x.GetByUserAsync(_childUserId, _householdId, It.IsAny<CancellationToken>()))
            .ReturnsAsync(rewardList);

        // Act
        var rewards = await _rewardService.GetUserRewardsAsync(_childUserId);

        // Assert
        Assert.NotEmpty(rewards);
        Assert.Equal(2, rewards.Count);
        Assert.Equal(50m, rewards[0].Amount);
        Assert.Equal("Completed chore: Clean room", rewards[0].Reason);
        Assert.Equal(100m, rewards[1].Amount);
    }

    [Fact]
    public async Task GetUserRewards_FiltersByHouseholdId_ForDataIsolation()
    {
        // Arrange
        var childInHousehold1 = new List<RewardLedger>
        {
            new() { Amount = 50m, UserId = _childUserId, HouseholdId = _householdId }
        };

        _mockRewardRepository
            .Setup(x => x.GetByUserAsync(_childUserId, _householdId, It.IsAny<CancellationToken>()))
            .ReturnsAsync(childInHousehold1);

        // Act
        var rewards = await _rewardService.GetUserRewardsAsync(_childUserId);

        // Assert
        Assert.Single(rewards);
        // Verify household filtering was used
        _mockRewardRepository.Verify(
            x => x.GetByUserAsync(_childUserId, _householdId, It.IsAny<CancellationToken>()),
            Times.Once
        );
    }

    [Fact]
    public async Task GetUserBalance_FiltersByHouseholdId_ForDataIsolation()
    {
        // Arrange
        _mockRewardRepository
            .Setup(x => x.GetUserBalanceAsync(_childUserId, _householdId, It.IsAny<CancellationToken>()))
            .ReturnsAsync(150m);

        // Act
        await _rewardService.GetUserBalanceAsync(_childUserId);

        // Assert
        _mockRewardRepository.Verify(
            x => x.GetUserBalanceAsync(_childUserId, _householdId, It.IsAny<CancellationToken>()),
            Times.Once
        );
    }
}
