import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";

interface FormErrors {
  name?: string;
  email?: string;
  password?: string;
}

type RegisterStep = "account" | "role" | "household" | "confirmation";

type Role = "ADULT" | "CHILD";

export const RegisterPage = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [step, setStep] = useState<RegisterStep>("account");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [role, setRole] = useState<Role | null>(null);

  const [householdOption, setHouseholdOption] = useState<
    "create" | "join" | null
  >(null);

  const [householdCode, setHouseholdCode] = useState("");
  const [householdName, setHouseholdName] = useState("");

  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState("");

  const validateAccount = (): boolean => {
    const newErrors: FormErrors = {};

    if (!name.trim()) {
      newErrors.name = "Namn krävs";
    } else if (name.trim().length < 2) {
      newErrors.name = "Namnet måste innehålla minst 2 tecken";
    }

    if (!email.trim()) {
      newErrors.email = "E-postadress krävs";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Ange en giltig e-postadress";
    }

    if (!password) {
      newErrors.password = "Lösenord krävs";
    } else if (password.length < 6) {
      newErrors.password = "Lösenordet måste innehålla minst 6 tecken";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const validateHousehold = (): boolean => {
    setApiError("");

    if (role === "CHILD" && !householdCode.trim()) {
      setApiError("Hushållskod krävs");
      return false;
    }

    if (role === "ADULT" && householdOption === "create") {
      if (!householdName.trim()) {
        setApiError("Namn på hushållet krävs");
        return false;
      }
    }

    if (role === "ADULT" && householdOption === "join") {
      if (!householdCode.trim()) {
        setApiError("Hushållskod krävs");
        return false;
      }
    }

    return true;
  };

  const registerUser = async () => {
    setLoading(true);
    setApiError("");

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/auth/register`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: name.trim(),
            email: email.trim(),
            password,
            householdName:
              role === "ADULT" && householdOption === "create"
                ? householdName.trim()
                : "",
            role,
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        setApiError(data.error || "Något gick fel vid registreringen.");
        return null;
      }

      localStorage.setItem("token", data.token);

      return data;
    } catch {
      setApiError("Kunde inte kontakta servern. Försök igen.");
      return null;
    } finally {
      setLoading(false);
    }
  };

  const joinHousehold = async () => {
    setLoading(true);
    setApiError("");

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
        setApiError(
          data.error || data.message || "Kunde inte gå med i hushållet.",
        );
        return false;
      }

      return true;
    } catch {
      setApiError("Kunde inte kontakta servern. Försök igen.");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const handleAccountSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateAccount()) {
      return;
    }

    setStep("role");
  };

  const handleRoleSelect = (selectedRole: Role) => {
    setRole(selectedRole);
    setHouseholdOption(null);
    setApiError("");
    setStep("household");
  };

  const handleBack = () => {
    setApiError("");

    if (step === "role") {
      setStep("account");
    }

    if (step === "household") {
      setStep("role");
    }
  };

  const handleCreateHousehold = async () => {
    if (!validateHousehold()) {
      return;
    }

    const registered = await registerUser();

    if (registered) {
      setStep("confirmation");

      setTimeout(() => {
        navigate("/");
      }, 5000);
    }
  };

  const handleJoinHousehold = async () => {
    if (!validateHousehold()) {
      return;
    }

    const registered = await registerUser();

    if (!registered) {
      return;
    }

    const joined = await joinHousehold();

    if (joined) {
      setStep("confirmation");
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        {step === "account" && (
          <>
            <h1>Skapa konto i Peppish</h1>

            <form onSubmit={handleAccountSubmit}>
              <div className="form-group">
                <label htmlFor="name">Namn</label>

                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);

                    if (errors.name) {
                      setErrors({
                        ...errors,
                        name: undefined,
                      });
                    }
                  }}
                  className={errors.name ? "input-error" : ""}
                  placeholder="Ditt namn"
                />

                {errors.name && (
                  <span className="error-text">{errors.name}</span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="email">E-post</label>

                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);

                    if (errors.email) {
                      setErrors({
                        ...errors,
                        email: undefined,
                      });
                    }
                  }}
                  className={errors.email ? "input-error" : ""}
                  placeholder="din@email.se"
                />

                {errors.email && (
                  <span className="error-text">{errors.email}</span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="password">Lösenord</label>

                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);

                    if (errors.password) {
                      setErrors({
                        ...errors,
                        password: undefined,
                      });
                    }
                  }}
                  className={errors.password ? "input-error" : ""}
                  placeholder="••••••••"
                />

                {errors.password && (
                  <span className="error-text">{errors.password}</span>
                )}
              </div>

              <button type="submit" className="btn-primary">
                Fortsätt
              </button>
            </form>

            <div className="login-footer">
              <p>
                Har du redan ett konto? <Link to="/login">Logga in här</Link>
              </p>
            </div>
          </>
        )}

        {step === "role" && (
          <>
            <h1>Vem är du?</h1>

            <div className="form-group">
              <button
                type="button"
                className="btn-primary"
                onClick={() => handleRoleSelect("CHILD")}
              >
                Jag är barn
              </button>
            </div>

            <div className="form-group">
              <button
                type="button"
                className="btn-primary"
                onClick={() => handleRoleSelect("ADULT")}
              >
                Jag är vuxen
              </button>
            </div>

            <button type="button" onClick={handleBack}>
              Tillbaka
            </button>
          </>
        )}

        {step === "household" && (
          <>
            {role === "CHILD" && (
              <>
                <h1>Gå med i ett hushåll</h1>

                <p>Be en vuxen i ditt hushåll om koden för att gå med.</p>

                <div className="form-group">
                  <label htmlFor="householdCode">Hushållskod</label>

                  <input
                    id="householdCode"
                    type="text"
                    value={householdCode}
                    onChange={(e) => {
                      setHouseholdCode(e.target.value);
                      setApiError("");
                    }}
                    placeholder="Ange kod"
                  />
                </div>

                {apiError && <span className="error-text">{apiError}</span>}

                <button
                  type="button"
                  className="btn-primary"
                  disabled={loading}
                  onClick={handleJoinHousehold}
                >
                  {loading ? "Registrerar..." : "Gå med"}
                </button>
              </>
            )}

            {role === "ADULT" && (
              <>
                <h1>Ditt hushåll</h1>

                <p>
                  Vill du skapa ett nytt hushåll eller gå med i ett befintligt?
                </p>

                <div className="form-group">
                  <button
                    type="button"
                    className="btn-primary"
                    onClick={() => {
                      setHouseholdOption("create");
                      setApiError("");
                    }}
                  >
                    Skapa nytt hushåll
                  </button>
                </div>

                <div className="form-group">
                  <button
                    type="button"
                    className="btn-primary"
                    onClick={() => {
                      setHouseholdOption("join");
                      setApiError("");
                    }}
                  >
                    Gå med med kod
                  </button>
                </div>

                {householdOption === "create" && (
                  <>
                    <div className="form-group">
                      <label htmlFor="householdName">Namn på hushållet</label>

                      <input
                        id="householdName"
                        type="text"
                        value={householdName}
                        onChange={(e) => {
                          setHouseholdName(e.target.value);
                          setApiError("");
                        }}
                        placeholder="Till exempel Familjen Andersson"
                      />
                    </div>

                    {apiError && <span className="error-text">{apiError}</span>}

                    <button
                      type="button"
                      className="btn-primary"
                      disabled={loading}
                      onClick={handleCreateHousehold}
                    >
                      {loading ? "Skapar konto..." : "Skapa hushåll"}
                    </button>
                  </>
                )}

                {householdOption === "join" && (
                  <>
                    <div className="form-group">
                      <label htmlFor="householdCode">Hushållskod</label>

                      <input
                        id="householdCode"
                        type="text"
                        value={householdCode}
                        onChange={(e) => {
                          setHouseholdCode(e.target.value);
                          setApiError("");
                        }}
                        placeholder="Ange kod"
                      />
                    </div>

                    {apiError && <span className="error-text">{apiError}</span>}

                    <button
                      type="button"
                      className="btn-primary"
                      disabled={loading}
                      onClick={handleJoinHousehold}
                    >
                      {loading ? "Registrerar..." : "Gå med"}
                    </button>
                  </>
                )}
              </>
            )}

            <button type="button" onClick={handleBack}>
              Tillbaka
            </button>
          </>
        )}

        {step === "confirmation" && (
          <>
            {role === "ADULT" && householdOption === "create" && (
              <>
                <h1>Välkommen till Peppish!</h1>
                <p>Ditt konto och ditt hushåll har skapats.</p>
                <p>Hushåll: {householdName}</p>
              </>
            )}

            {householdOption === "join" && (
              <>
                <h1>Ansökan skickad</h1>
                <p>Din ansökan om att gå med i hushållet har skickats.</p>
                <p>
                  Du kommer att tillhöra hushållet när en vuxen medlem har
                  godkänt dig.
                </p>
                <button
                  type="button"
                  className="btn-primary"
                  onClick={() => {
                    logout();
                    navigate("/login");
                  }}
                >
                  Logga in
                </button>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
};
