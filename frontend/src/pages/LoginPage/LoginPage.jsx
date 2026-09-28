import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { FaGithub } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";

import { loginUser } from "../../api/auth.api.js";
import "./loginPage.css";

const API_URL = "http://localhost:3003/api/auth";

function LoginPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Pending Google/GitHub identity waiting to be linked (from URL hash)
  const [linkToken] = useState(
    () => new URLSearchParams(window.location.hash.slice(1)).get("link") || "",
  );

  useEffect(() => {
    // Keep the link token out of the address bar and history
    if (window.location.hash) {
      window.history.replaceState(
        null,
        "",
        window.location.pathname + window.location.search,
      );
    }
  }, [searchParams]);

  const oauthStatus = searchParams.get("oauth");
  const displayedError =
    error ||
    (oauthStatus === "failed"
      ? "Sign-in with that provider failed. Please try again."
      : "");
  const displayedInfo =
    info ||
    (oauthStatus === "exists"
      ? "An account with this email already exists. Sign in with your password once to link it."
      : "");

  function handleChange(event) {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  function handleOAuthLogin(provider) {
    window.location.assign(`${API_URL}/${provider}`);
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setInfo("");

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
        linkToken: linkToken || undefined,
      });

      localStorage.setItem("access_token", result.token);
      navigate("/chat", { replace: true });
    } catch (err) {
      const message =
        err.response?.data?.message ||
        err.response?.data?.error ||
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
          <button type="button" onClick={() => handleOAuthLogin("github")}>
            <FaGithub className="social-icon" aria-hidden="true" />
            GitHub
          </button>

          <button type="button" onClick={() => handleOAuthLogin("google")}>
            <FcGoogle className="social-icon" aria-hidden="true" />
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

          {displayedInfo && (
            <p className="login-message" role="status">
              {displayedInfo}
            </p>
          )}

          {displayedError && (
            <p className="login-message login-error" role="alert">
              {displayedError}
            </p>
          )}

          <button className="login-submit" type="submit" disabled={loading}>
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
