using API_Peppish.Repositories;
using API_Peppish.Services;
using API_Peppish.DTOs;
using API_Peppish.Entities;
using Moq;
using Xunit;

namespace API_Peppish.Tests.Services;

public class RewardServiceTests
{
    private readonly Mock<IRewardRepository> _mockRewardRepository;
    private readonly Mock<IUserContextService> _mockUserContextService;
    private readonly RewardService _rewardService;

    private readonly Guid _householdId = Guid.NewGuid();
    private readonly string _userId = "test-user-123";

    public RewardServiceTests()
    {
        _mockRewardRepository = new Mock<IRewardRepository>();
        _mockUserContextService = new Mock<IUserContextService>();
        _rewardService = new RewardService(_mockRewardRepository.Object, _mockUserContextService.Object);

        _mockUserContextService.Setup(x => x.GetCurrentHouseholdId()).Returns(_householdId);
    }

    [Fact]
    public async Task GetUserBalanceAsync_ReturnsCorrectBalance_WhenUserHasRewards()
    {
        // Arrange
        decimal expectedBalance = 150.50m;
        _mockRewardRepository
            .Setup(x => x.GetUserBalanceAsync(_userId, _householdId, It.IsAny<CancellationToken>()))
            .ReturnsAsync(expectedBalance);

        // Act
        var result = await _rewardService.GetUserBalanceAsync(_userId);

        // Assert
        Assert.Equal(expectedBalance, result);
        _mockRewardRepository.Verify(x => x.GetUserBalanceAsync(_userId, _householdId, It.IsAny<CancellationToken>()), Times.Once);
    }

    [Fact]
    public async Task GetUserBalanceAsync_ReturnsZero_WhenUserHasNoRewards()
    {
        // Arrange
        _mockRewardRepository
            .Setup(x => x.GetUserBalanceAsync(_userId, _householdId, It.IsAny<CancellationToken>()))
            .ReturnsAsync(0m);

        // Act
        var result = await _rewardService.GetUserBalanceAsync(_userId);

        // Assert
        Assert.Equal(0m, result);
    }

    [Fact]
    public async Task GetUserRewardsAsync_ReturnsEmptyList_WhenUserHasNoRewards()
    {
        // Arrange
        _mockRewardRepository
            .Setup(x => x.GetByUserAsync(_userId, _householdId, It.IsAny<CancellationToken>()))
            .ReturnsAsync(new List<RewardLedger>());

        // Act
        var result = await _rewardService.GetUserRewardsAsync(_userId);

        // Assert
        Assert.Empty(result);
    }

    [Fact]
    public async Task GetUserRewardsAsync_ReturnsCorrectRewards_WhenUserHasRewards()
    {
        // Arrange
        var rewards = new List<RewardLedger>
        {
            new() { Amount = 50m, Reason = "Completed chore: Clean room", CreatedAt = DateTime.UtcNow },
            new() { Amount = 100m, Reason = "Completed chore: Dishes", CreatedAt = DateTime.UtcNow.AddDays(-1) }
        };

        _mockRewardRepository
            .Setup(x => x.GetByUserAsync(_userId, _householdId, It.IsAny<CancellationToken>()))
            .ReturnsAsync(rewards);

        // Act
        var result = await _rewardService.GetUserRewardsAsync(_userId);

        // Assert
        Assert.NotEmpty(result);
        Assert.Equal(2, result.Count);
        Assert.Equal(50m, result[0].Amount);
        Assert.Equal("Completed chore: Clean room", result[0].Reason);
        Assert.Equal(100m, result[1].Amount);
    }

    [Fact]
    public async Task GetUserRewardsAsync_UsesCurrentHouseholdId_ForFiltering()
    {
        // Arrange
        var rewards = new List<RewardLedger>();
        _mockRewardRepository
            .Setup(x => x.GetByUserAsync(_userId, _householdId, It.IsAny<CancellationToken>()))
            .ReturnsAsync(rewards);

        // Act
        await _rewardService.GetUserRewardsAsync(_userId);

        // Assert - Verify that GetCurrentHouseholdId was called
        _mockUserContextService.Verify(x => x.GetCurrentHouseholdId(), Times.Once);
        _mockRewardRepository.Verify(x => x.GetByUserAsync(_userId, _householdId, It.IsAny<CancellationToken>()), Times.Once);
    }
}
