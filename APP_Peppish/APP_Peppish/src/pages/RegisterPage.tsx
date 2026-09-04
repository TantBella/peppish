import { useState } from "react";
import { Link } from "react-router-dom";

interface FormErrors {
  name?: string;
  email?: string;
  password?: string;
}

type RegisterStep = "account" | "role";

type Role = "ADULT" | "CHILD";

export const RegisterPage = () => {
  const [step, setStep] = useState<RegisterStep>("account");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [role, setRole] = useState<Role | null>(null);

  const [errors, setErrors] = useState<FormErrors>({});

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

  const handleAccountSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateAccount()) {
      return;
    }

    setStep("role");
  };

  const handleRoleSelect = (selectedRole: Role) => {
    setRole(selectedRole);
  };

  const handleBack = () => {
    setStep("account");
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

            {role && <p>Du valde: {role === "CHILD" ? "Barn" : "Vuxen"}</p>}

            <button type="button" onClick={handleBack}>
              Tillbaka
            </button>
          </>
        )}
      </div>
    </div>
  );
};
