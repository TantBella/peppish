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
  const moneyValue = Number(balance?.totalMoney ?? balance?.moneyBalance ?? 0);

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
                  <p>{moneyValue.toFixed(2)} kr</p>
                </div>
              </div>
              <div className="balance-card progress">
                <div className="balance-label">Dina XP: </div>
                <div className="balance-value">💎 </div>
                <div className="balance-value">
                  <p>{progress?.currentXp} XP</p>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="history-section">
          <h2>Senaste belöningarna: </h2>
          {history.length === 0 ? (
            <p className="no-rewards">
              Du har tyvärr inte fått några belöningar ännu.. Genomför en quest
              för att få XP eller pengar.{" "}
            </p>
          ) : (
            <div className="rewards-list">
              {history.map((reward) => {
                const rawMoney = Number((reward as any)?.moneyAmount ?? 0);
                const rawXp = Number((reward as any)?.xpAmount ?? 0);
                const normalizedType =
                  rawMoney > 0 ? "money" : (reward.type ?? "progress");
                const amount =
                  normalizedType === "money"
                    ? rawMoney || Number(reward.value ?? 0)
                    : rawXp || Number(reward.value ?? 0);
                const amountLabel =
                  normalizedType === "money"
                    ? `${amount.toFixed(2)} kr`
                    : `${amount} XP`;

                return (
                  <div
                    key={reward.id}
                    className={`reward-item reward-${normalizedType}`}
                  >
                    <div className="reward-icon">
                      {normalizedType === "money" ? "🤑" : "💎"}
                    </div>
                    <div className="reward-details">
                      <div className="reward-value">+ {amountLabel}</div>
                      <div className="reward-date">
                        {new Date(
                          reward.createdAt ?? Date.now(),
                        ).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </>
  );
};
