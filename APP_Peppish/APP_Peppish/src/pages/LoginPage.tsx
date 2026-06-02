import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";

interface FormErrors {
  email?: string;
  password?: string;
  submit?: string;
}

export const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const { addToast } = useToast();

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!email.trim()) {
      newErrors.email = "Email är obligatoriskt";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Ogiltig email";
    }

    if (!password) {
      newErrors.password = "Lösenord är obligatoriskt";
    } else if (password.length < 8) {
      newErrors.password = "Lösenordet måste vara minst 8 tecken";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      await login(email, password);
      navigate("/");
    } catch (err: any) {
      const msg = err?.message || "Inloggning misslyckades. Försök igen.";
      setErrors({ submit: msg });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h1>Logga in</h1>

        {errors.submit && (
          <div className="error-message alert alert-error">{errors.submit}</div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (errors.email) setErrors({ ...errors, email: undefined });
              }}
              disabled={isLoading}
              className={errors.email ? "input-error" : ""}
              placeholder="your@email.com"
            />
            {errors.email && <span className="error-text">{errors.email}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="password">Lösenord</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (errors.password)
                  setErrors({ ...errors, password: undefined });
              }}
              disabled={isLoading}
              className={errors.password ? "input-error" : ""}
              placeholder="••••••••"
            />
            {errors.password && (
              <span className="error-text">{errors.password}</span>
            )}
          </div>

          <button type="submit" disabled={isLoading} className="btn-primary">
            {isLoading ? "Loggar in..." : "Login"}
          </button>
        </form>

        <div className="login-footer">
          <p>
            Har du inget konto? <Link to="/register">Registera här</Link>
          </p>
        </div>
      </div>
    </div>
  );
};
