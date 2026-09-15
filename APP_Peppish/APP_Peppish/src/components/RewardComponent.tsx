import { useUserBalance, useRewardHistory } from "../hooks/useRewards";
import Loading from "../components/Loading";
import { useProgress } from "../hooks/useProgress";

export const RewardComponent = () => {
  const {
    data: balance,
    isLoading: balanceLoading,
    error: balanceError,
  } = useUserBalance();
  const { data: progress } = useProgress();
  const {
    data: history = [],
    isLoading: historyLoading,
    error: historyError,
  } = useRewardHistory(20);

  const isLoading = balanceLoading || historyLoading;
  const error = balanceError || historyError;

  if (isLoading) {
    return <Loading message="Laddar..." />;
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
        <h2>Belöningar </h2>
        {balance && (
          <div className="balance-section">
            <div className="balance-cards">
              <div className="balance-card money">
                <div className="balance-label">Intjänat: </div>
                <div className="balance-value">🤑 </div>{" "}
                <div className="balance-value">
                  {/* {balance.totalMoney.toFixed(2)} */}
                </div>
              </div>
              <div className="balance-card progress">
                <div className="balance-label">Dina XP: </div>
                <div className="balance-value">💎 </div>
                <div className="balance-value">{progress?.currentXp} </div>
              </div>
            </div>
          </div>
        )}

        <div className="history-section">
          <h2>istället för Tidigare belöningar: </h2>
          {history.length === 0 ? (
            <p className="no-rewards">
              nånting annat men vad Du har tyvärr inte fått några belöningar
              ännu.. Genomför en quest för att få XP eller pengar.{" "}
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
