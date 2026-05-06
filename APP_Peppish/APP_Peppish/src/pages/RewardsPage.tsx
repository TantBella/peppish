import { useUserBalance, useRewardHistory } from '../hooks/useRewards'

export const RewardsPage = () => {
  const { data: balance, isLoading: balanceLoading, error: balanceError } = useUserBalance()
  const { data: history = [], isLoading: historyLoading, error: historyError } = useRewardHistory(20)

  const isLoading = balanceLoading || historyLoading
  const error = balanceError || historyError

  if (isLoading) {
    return <div className="loading-container"><div className="spinner">Loading rewards...</div></div>
  }

  if (error) {
    return <div className="error-message alert alert-error">Failed to load rewards</div>
  }

  return (
    <div className="rewards-container">
      <h1>Rewards</h1>

      {balance && (
        <div className="balance-section">
          <h2>Your Balance</h2>
          <div className="balance-cards">
            <div className="balance-card money">
              <div className="balance-label">Money Earned</div>
              <div className="balance-value">${balance.totalMoney.toFixed(2)}</div>
            </div>
            <div className="balance-card progress">
              <div className="balance-label">Progress Points</div>
              <div className="balance-value">{balance.totalProgress} ⭐</div>
            </div>
          </div>
        </div>
      )}

      <div className="history-section">
        <h2>Reward History</h2>
        {history.length === 0 ? (
          <p className="no-rewards">No rewards earned yet. Complete and get approved on chores to earn rewards!</p>
        ) : (
          <div className="rewards-list">
            {history.map((reward) => (
              <div key={reward.id} className={`reward-item reward-${reward.type}`}>
                <div className="reward-icon">
                  {reward.type === 'money' ? '$' : '⭐'}
                </div>
                <div className="reward-details">
                  <div className="reward-value">{reward.value}</div>
                  <div className="reward-date">
                    {new Date(reward.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
