import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { householdServiceApi } from "../services/householdService.api";
import { useAuth } from "../context/AuthContext";

export const NoHouseholdPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [option, setOption] = useState<"create" | "join" | null>(
    user?.role === "CHILD" ? "join" : null,
  );

  const [householdName, setHouseholdName] = useState("");
  const [householdCode, setHouseholdCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const createHousehold = async () => {
    if (!householdName.trim()) {
      setError("Namn på hushållet krävs.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      await householdServiceApi.createHousehold(householdName.trim());
      window.location.reload();
    } catch {
      setError("Kunde inte skapa hushållet.");
    } finally {
      setLoading(false);
    }
  };

  const joinHousehold = async () => {
    if (!householdCode.trim()) {
      setError("Hushållskod krävs.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/households/join`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            joinCode: householdCode.trim(),
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || data.message || "Kunde inte skicka förfrågan.");
        return;
      }

      navigate("/");
    } catch {
      setError("Kunde inte kontakta servern. Försök igen.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h1>Ditt hushåll</h1>

        {user?.role === "CHILD" ? (
          <>
            <p>Fyll i koden för ditt hushåll.</p>
            <button
              type="button"
              className="btn-primary"
              onClick={() => setOption("join")}
            >
              Gå med i ett hushåll
            </button>
          </>
        ) : (
          <p>Du tillhör inget hushåll ännu. Vad vill du göra?</p>
        )}

        {user?.role === "ADULT" && !option && (
          <>
            <button
              type="button"
              className="btn-primary"
              onClick={() => setOption("create")}
            >
              Skapa nytt hushåll
            </button>

            <button
              type="button"
              className="btn-primary"
              onClick={() => setOption("join")}
            >
              Gå med i ett hushåll
            </button>
          </>
        )}

        {option === "create" && user?.role === "ADULT" && (
          <>
            <div className="form-group">
              <label htmlFor="householdName">Namn på hushållet</label>

              <input
                id="householdName"
                type="text"
                value={householdName}
                onChange={(e) => {
                  setHouseholdName(e.target.value);
                  setError("");
                }}
                placeholder="Till exempel Familjen Andersson"
              />
            </div>

            {error && <span className="error-text">{error}</span>}

            <button
              type="button"
              className="btn-primary"
              disabled={loading}
              onClick={createHousehold}
            >
              {loading ? "Skapar..." : "Skapa hushåll"}
            </button>

            <button
              type="button"
              onClick={() => {
                setOption(null);
                setError("");
              }}
            >
              Tillbaka
            </button>
          </>
        )}

        {option === "join" && (
          <>
            <div className="form-group">
              <label htmlFor="householdCode">Hushållskod</label>

              <input
                id="householdCode"
                type="text"
                value={householdCode}
                onChange={(e) => {
                  setHouseholdCode(e.target.value);
                  setError("");
                }}
                placeholder="Ange kod"
              />
            </div>

            {error && <span className="error-text">{error}</span>}

            <button
              type="button"
              className="btn-primary"
              disabled={loading}
              onClick={joinHousehold}
            >
              {loading ? "Skickar..." : "Gå med"}
            </button>

            {user?.role === "ADULT" && (
              <button
                type="button"
                onClick={() => {
                  setOption(null);
                  setError("");
                }}
              >
                Tillbaka
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
};
