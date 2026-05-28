import { useMemo } from "react";
import { useAuth } from "../context/AuthContext";
import logoName from "../assets/logo.png";
import mottos from "../data/mottos.json";
import { Link } from "react-router-dom";

export const HomePage = () => {
  const { user } = useAuth();

  const randomMotto = useMemo(() => {
    const randomIndex = Math.floor(Math.random() * mottos.motto.length);
    return mottos.motto[randomIndex];
  }, []);

  return (
    <div className="home-page">
      <header className="home-header">
        <img src={logoName} alt="App logo" className="Peppish-logo" />

        <p className="home-motto">{randomMotto}</p>
      </header>

      <div className="home-section">
        <h1>Välkommen, {user?.name}!</h1>
        <div className="user-info">
          <p>
            <strong>Hushållsroll:</strong>
            {user?.role === "adult" ? "Adult" : "Child"}
          </p>
          <p>
            nån mer typ text här och kanske en bild på sin avatar och så kan man
            klicka på den för att komma in på en sida som ändrar hur den ser ut
          </p>
        </div>
      </div>
      <div className="home-container">
        <div className="home-content">
          <p>nånting här, typ reklam?</p>
        </div>
        <div className="home-content">
          <p>something something</p>
        </div>
        <div className="home-content">
          <Link to="/households">Inställningar</Link>
        </div>
        <div className="home-content">
          <p>nånting här</p>
        </div>
        <div className="home-content">
          <Link to="/chores">Uppgifter & Sysslor</Link>
        </div>
        {user?.role === "adult" && (
          <div className="home-content">
            <Link to="/chores/new">Skapa ny uppgift</Link>
          </div>
        )}
      </div>
    </div>
  );
};
