namespace API_Peppish.DTOs
{
    public class UserDashboardDto
    {
        public BalanceDto Balance { get; set; } = default!;
        public ProgressDto Progress { get; set; } = default!;
        public List<RewardDto> RecentRewards { get; set; } = [];
    }
}
