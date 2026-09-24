import { useProgress } from "../hooks/useProgress";
import { useAuth } from "../context/AuthContext";
import { useChores } from "../hooks/useChores";
import {
  getDailyProgressPercent,
  getTodaysChores,
} from "../utils/dailyProgress";

import Loading from "../components/Loading";

export const ProgressComponent = () => {
  const { user } = useAuth();
  const { data: progress, isLoading, error } = useProgress();
  const {
    data: chores = [],
    isLoading: choresLoading,
    error: choresError,
  } = useChores();

  if (isLoading || choresLoading) {
    return <Loading message="Laddar..." />;
  }

  if (error || choresError) {
    return (
      <div className="error-message alert alert-error">
        Kunde inte ladda din progress.
      </div>
    );
  }

  if (!progress) {
    return null;
  }

  const dailyProgressPercent = getDailyProgressPercent(chores, user?.id);
  const todaysChores = getTodaysChores(chores, user?.id).sort((left, right) => {
    const statusOrder = {
      approved: 0,
      completed: 1,
      assigned: 2,
      available: 3,
    };
    return statusOrder[left.uiStatus] - statusOrder[right.uiStatus];
  });

  return (
    <div className="progress-container">
      <div className="daily-card">
        <h2>Dagens progress</h2>
        <div className="daily-progress-label">
          <span>Klarade quests:</span>
          <span>{dailyProgressPercent}%</span>
        </div>

        <div className="progress-bar-container">
          {todaysChores.length === 0 ? (
            <div className="progress-bar-empty" />
          ) : (
            todaysChores.map((chore) => (
              <div
                key={chore.id}
                className={`progress-segment ${chore.uiStatus}`}
                aria-label={`${chore.title}: ${chore.uiStatus}`}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
};
