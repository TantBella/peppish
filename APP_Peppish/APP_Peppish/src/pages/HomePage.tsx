import { useMemo } from "react";
import { useAuth } from "../context/AuthContext";
import logoName from "../assets/logo.png";
import mottos from "../data/mottos.json";
import { Link, useNavigate } from "react-router-dom";
import NotificationPanel from "../components/NotificationPanel";
import { useProgress } from "../hooks/useProgress";

export const HomePage = () => {
  const { user } = useAuth();
  const { progress, loading, error } = useProgress();
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

      <div className="home-section">
        <section className="home-card user-summary">
          <h1>Hej, {user?.name}!</h1>
          <p> {user?.role === "ADULT" ? "Vuxen" : "Barn"} </p>
          {/* Avatar, XP och level kommer här */}
        </section>
        <p>
          nån mer typ text här och kanske en bild på sin avatar och så kan man
          klicka på den för att komma in på en sida som ändrar hur den ser ut
        </p>
      </div>
      <div className="home-container">
        <div className="home-content">
          <section className="home-card">
            <h2>Din progress</h2> {loading && <p>Laddar progress...</p>}
            {error && <p>{error}</p>}
            {progress && (
              <>
                <p>Level {progress.currentLevel}</p>
                <p> {progress.currentXp} XP </p>
                <div className="progress-bar">
                  <div
                    className="progress-bar-fill"
                    style={{ width: `${progress.dailyProgressPercent}%` }}
                  />
                </div>
                <p>{progress.dailyProgressPercent}% av dagens uppgifter</p>
              </>
            )}
          </section>
        </div>
        <div className="home-content">
          <p></p>
        </div>
        <div className="home-content">
          <button onClick={() => navigate("/households")}>Mitt hushåll</button>
        </div>
        <div className="home-content">
          <section className="home-card">
            <h2>Nästa belöning</h2> {/* Nästa reward kommer här */}
          </section>
        </div>
        <div className="home-content">
          <Link to="/chores">Uppgifter & Sysslor</Link>
        </div>
        {user?.role === "ADULT" && (
          <div className="home-content">
            <Link to="/chores/new">Skapa ny uppgift</Link>
          </div>
        )}
        <div className="home-content">
          <p></p>
        </div>
      </div>
    </div>
  );
};
