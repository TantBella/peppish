import { useUserBalance, useRewardHistory } from "../hooks/useRewards";
import logoImg from "../assets/logo_img.png";

export const RewardsPage = () => {
  const {
    data: balance,
    isLoading: balanceLoading,
    error: balanceError,
  } = useUserBalance();
  const {
    data: history = [],
    isLoading: historyLoading,
    error: historyError,
  } = useRewardHistory(20);

  const isLoading = balanceLoading || historyLoading;
  const error = balanceError || historyError;

  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="spinner">Loading rewards...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-message alert alert-error">
        Failed to load rewards
      </div>
    );
  }

  return (
    <>
      <div className="rewards-container">
        <h1 className="logo-icon">
          <img src={logoImg} alt="App logo" /> Belöningar{" "}
        </h1>
        {balance && (
          <div className="balance-section">
            <div className="balance-cards">
              <div className="balance-card money">
                <div className="balance-label">Intjänat: </div>
                <div className="balance-value">🤑 </div>{" "}
                <div className="balance-value">
                  {balance.totalMoney.toFixed(2)}
                </div>
              </div>
              <div className="balance-card progress">
                <div className="balance-label">Dina XP: </div>
                <div className="balance-value">💎 </div>
                <div className="balance-value">{balance.totalProgress} </div>
              </div>
            </div>
          </div>
        )}

        <div className="history-section">
          <h2>Tidigare belöningar:</h2>
          {history.length === 0 ? (
            <p className="no-rewards">
              Du har tyvärr inte fått några belöningar ännu.. Genomför en quest
              för att få XP eller pengar.{" "}
            </p>
          ) : (
            <div className="rewards-list">
              {history.map((reward) => (
                <div
                  key={reward.id}
                  className={`reward-item reward-${reward.type}`}
                >
                  <div className="reward-icon">
                    {reward.type === "money" ? "🤑" : "💎"}
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
    </>
  );
};
