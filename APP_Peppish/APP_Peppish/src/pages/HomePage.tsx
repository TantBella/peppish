import { useMemo } from "react";
import { useAuth } from "../context/AuthContext";
import logoName from "../assets/logo.png";
import mottos from "../data/mottos.json";
import { Link, useNavigate } from "react-router-dom";
import NotificationPanel from "../components/NotificationPanel";
import { useProgress } from "../hooks/useProgress";
import { useChores } from "../hooks/useChores";
import { getDailyProgressPercent } from "../utils/dailyProgress";

const choreStatusLabels: Record<string, string> = {
  available: "Tillgänglig",
  assigned: "Ej påbörjad",
  completed: "Klar, väntar på godkännande",
  approved: "Godkänd",
};

export const HomePage = () => {
  const { user } = useAuth();
  const { data: progress, isLoading: loading, error } = useProgress();
  const {
    data: chores = [],
    isLoading: choresLoading,
    error: choresError,
  } = useChores();
  const navigate = useNavigate();

  const randomMotto = useMemo(() => {
    const randomIndex = Math.floor(Math.random() * mottos.motto.length);
    return mottos.motto[randomIndex];
  }, []);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const todaysChores = chores.filter((chore) => {
    const dueDate = new Date(chore.dueDate);
    dueDate.setHours(0, 0, 0, 0);

    return (
      dueDate.getTime() === today.getTime() &&
      chore.assignedToUserId === user?.id
    );
  });
  const dailyProgressPercent = getDailyProgressPercent(chores, user?.id);

  return (
    <>
      <header className="home-header">
        <img src={logoName} alt="App logo" className="Peppish-logo" />
        <p className="home-motto">{randomMotto}</p>
        <div className="notification-container">
          <NotificationPanel />
        </div>
      </header>

      <div className="home-page">
        <section className="home-content">
          <h1>Hej, {user?.name}!</h1>
          <div className="user-summary-content">
            <p>Dags att samla lite XP!</p>
            <div className="avatar-placeholder">
              <p>Avatar</p>
            </div>
          </div>
        </section>

        <div
          className="home-content todays-quests-card"
          role="button"
          tabIndex={0}
          onClick={() => navigate("/calendar")}
          onKeyDown={(event) => {
            if (event.key === "Enter" || event.key === " ") {
              event.preventDefault();
              navigate("/calendar");
            }
          }}
          aria-label="Öppna dagens quests i kalendern"
        >
          <h2>Dagens quests</h2>
          {choresLoading && <p>Laddar dagens quests...</p>}
          {choresError && <p>Kunde inte ladda dagens quests.</p>}
          {!choresLoading && !choresError && todaysChores.length === 0 && (
            <p>Du har inga quests idag.</p>
          )}
          {!choresLoading && !choresError && todaysChores.length > 0 && (
            <div className="home-quest-list">
              {todaysChores.map((chore) => (
                <div key={chore.id} className="home-quest-row">
                  <span>• {chore.title} </span>
                  <span>
                    {choreStatusLabels[chore.status.toLowerCase()] ??
                      chore.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="home-content">
          <div className="card-label">
            <p>Dagens framsteg: </p>
            <span>
              <p></p>
            </span>
            <p>{dailyProgressPercent}% av dagens quests</p>
          </div>

          {loading && <p>Laddar progress...</p>}
          {error && <p>Kunde inte ladda progress.</p>}
          {progress && (
            <div className="progress-bar">
              <div
                className="progress-bar-fill"
                style={{
                  width: `${dailyProgressPercent}%`,
                }}
              />
            </div>
          )}
        </div>

        <div className="home-content">
          <h2>Din avatar</h2>
          <p>Här kan du se och anpassa din avatar.</p>
          <p>Din avatar kommer att utvecklas tillsammans med din level.</p>
          <Link to="/avatar">Anpassa din avatar</Link>
        </div>

        <div className="homepage-grid">
          <div
            className="home-content todays-quests-card"
            role="button"
            tabIndex={0}
            onClick={() => navigate("/chores")}
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                navigate("/chores");
              }
            }}
            aria-label="Tillgängliga quests"
          >
            <h2>Lediga quests</h2>
          </div>

          {user?.role === "ADULT" && (
            <div
              className="home-content todays-quests-card"
              role="button"
              tabIndex={0}
              onClick={() => navigate("/chores/new")}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  navigate("/chores/new");
                }
              }}
              aria-label="Skapa nya quests"
            >
              <h2>skapa quest</h2>
            </div>
          )}

          <div
            className="home-content todays-quests-card"
            role="button"
            tabIndex={0}
            onClick={() => navigate("/households")}
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                navigate("/households");
              }
            }}
            aria-label="Se ditt hushåll"
          >
            <h2>Mitt hushåll</h2>
          </div>
        </div>
      </div>
    </>
  );
};
