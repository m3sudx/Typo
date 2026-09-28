import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../../api/auth.api.js";
import "./loginPage.css";

function LoginPage() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    setError("");

    const { email, password } = formData;

    if (!email.trim() || !password) {
      setError("Please fill in all fields.");
      return;
    }

    try {
      setLoading(true);

      const result = await loginUser({
        email: email.trim(),
        password,
      });

      localStorage.setItem("access_token", result.token);

      navigate("/chat", { replace: true });
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.response?.data?.error ||
        "Login failed. Please try again.";

      setError(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="login-page">
      <section className="login-card">
        <div className="login-logo" aria-label="Typo logo">
          {"{↵}"}
        </div>

        <header className="login-heading">
          <h1>Welcome back</h1>
          <p>Sign in to your TYPO developer workspace</p>
        </header>

        <div className="login-social-buttons">
          <button type="button" disabled title="GitHub login is not configured yet">
            <span className="social-icon github-icon">●</span>
            GitHub
          </button>

          <button type="button" disabled title="Google login is not configured yet">
            <span className="social-icon google-icon">G</span>
            Google
          </button>
        </div>

        <div className="login-divider">
          <span>OR CONTINUE</span>
          <span>WITH EMAIL</span>
        </div>

        <form className="login-form" onSubmit={handleSubmit}>
          <div className="login-field">
            <div className="login-label-row">
              <label htmlFor="email">Work Email</label>
              <span>user@company.com</span>
            </div>

            <input
              id="email"
              name="email"
              type="email"
              placeholder="you@example.com"
              value={formData.email}
              onChange={handleChange}
              autoComplete="email"
              required
            />
          </div>

          <div className="login-field">
            <div className="login-label-row">
              <label htmlFor="password">Password</label>
              <button
                className="forgot-password"
                type="button"
                disabled
                title="Password recovery is not implemented yet"
              >
                Forgot password?
              </button>
            </div>

            <div className="password-input-wrapper">
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                autoComplete="current-password"
                required
              />

              <button
                className="password-visibility"
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? "hide" : "visibility"}
              </button>
            </div>
          </div>

          {error && (
            <p className="login-message login-error" role="alert">
              {error}
            </p>
          )}

          <button
            className="login-submit"
            type="submit"
            disabled={loading}
          >
            <span>{loading ? "Signing in..." : "Sign in"}</span>
            {!loading && (
              <span className="login-enter-key">
                ↵ <kbd>Enter</kbd>
              </span>
            )}
          </button>
        </form>

        <footer className="login-footer">
          <span>New to TYPO?</span>
          <Link to="/register">Create an account</Link>
        </footer>
      </section>
    </main>
  );
}

export default LoginPage;