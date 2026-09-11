import { useProgress } from "../hooks/useProgress";

import Loading from "../components/Loading";

export const ProgressComponent = () => {
  const { data: progress, isLoading, error } = useProgress();

  if (isLoading) {
    return <Loading message="Laddar..." />;
  }

  if (error) {
    return (
      <div className="error-message alert alert-error">
        Kunde inte ladda progress.
      </div>
    );
  }

  if (!progress) {
    return null;
  }

  return (
    <div className="progress-container">
      <h1>Din XP</h1>

      <div className="avatar-section">
        <h2>Level {progress.currentLevel}</h2>

        <div className="experience-section">
          <div className="experience-label">XP</div>

          <div className="progress-bar-container">
            <div
              className="progress-bar-fill"
              style={{
                width: `${progress.dailyProgressPercent}%`,
              }}
            />
          </div>

          <div className="experience-text">{progress.currentXp} XP</div>
        </div>
      </div>

      <div className="daily-section">
        <h2>Dagens progress</h2>

        <div className="daily-card">
          <div className="progress-label">Klarade quests</div>

          <div className="progress-bar-container">
            <div
              className="progress-bar-fill daily"
              style={{
                width: `${progress.dailyProgressPercent}%`,
              }}
            />
          </div>

          <div className="progress-percentage">
            {progress.dailyProgressPercent}%
          </div>
        </div>
      </div>
    </div>
  );
};
