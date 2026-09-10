import { useMemo } from "react";
import { useAuth } from "../context/AuthContext";
import logoName from "../assets/logo.png";
import mottos from "../data/mottos.json";
import { Link, useNavigate } from "react-router-dom";
import NotificationPanel from "../components/NotificationPanel";
import { useProgress } from "../hooks/useProgress";

export const HomePage = () => {
  const { user } = useAuth();
  const { data: progress, isLoading: loading, error } = useProgress();
  const navigate = useNavigate();

  const randomMotto = useMemo(() => {
    const randomIndex = Math.floor(Math.random() * mottos.motto.length);
    return mottos.motto[randomIndex];
  }, []);

  return (
    <div className="home-page">
      <header className="home-header">
        <img src={logoName} alt="App logo" className="Peppish-logo" />

        <p className="home-motto">{randomMotto}</p>

        <div className="notification-container">
          <NotificationPanel />
        </div>
      </header>

      <div className="home-container">
        <section className="home-content">
          <h1>Hej, {user?.name}!</h1>
          <div className="user-summary-content">
            <p>
              {user?.role === "ADULT"
                ? "Ditt hushåll väntar på dig."
                : "Dags att samla lite XP!"}
            </p>
            <div className="avatar-placeholder">
              <p>Avatar</p>
            </div>
          </div>
        </section>
      </div>

      <div className="home-container home-content-container">
        <div className="home-content">
          <div className="card-label">
            <p>DIN PROGRESS</p>
            <h2>Level {progress?.currentLevel ?? 1}</h2>
          </div>

          <div className="xp-display">
            <strong>{progress?.currentXp ?? 0}</strong>
            <span>XP</span>
          </div>
          {loading && <p>Laddar progress...</p>}
          {error && <p>Kunde inte ladda progress.</p>}
          {progress && (
            <>
              <div className="progress-bar">
                <div
                  className="progress-bar-fill"
                  style={{
                    width: `${progress.dailyProgressPercent}%`,
                  }}
                />
              </div>

              <div className="progress-card-footer">
                <p>{progress.dailyProgressPercent}% av dagens quests</p>
              </div>
            </>
          )}
        </div>

        <div className="home-content">
          <h2>Dagens quests</h2>
          <p>Här ser du vad som behöver göras idag.</p>
          <p>Du har inga quests ännu.</p>
        </div>

        <div className="home-content">
          <h2>Nästa belöning</h2>
        </div>
        <div className="home-content">
          <h2>Din avatar</h2>
          <p>Här kan du se och anpassa din avatar.</p>
          <p>Din avatar kommer att utvecklas tillsammans med din level.</p>

          <Link to="/avatar">Anpassa din avatar</Link>
        </div>
        {user?.role === "ADULT" && (
          <div className="home-content">
            <Link to="/chores/new">Skapa ny quest</Link>
          </div>
        )}
        <div className="home-content">
          <button
            className="home-content-button"
            onClick={() => navigate("/households")}
          >
            Mitt hushåll
          </button>
        </div>
      </div>
    </div>
  );
};
