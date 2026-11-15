import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { FaGithub } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { Eye, EyeOff, Sparkles, CheckCircle2 } from "lucide-react";

import { loginUser } from "../../api/auth.api.js";
import typo_logo from "../../assets/image/typo-logo.png";
import "./loginPage.css";

const API_URL = "http://localhost:3003/api/auth";

export default function LoginPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Pending Google/GitHub identity waiting to be linked (from URL hash)
  const [linkToken] = useState(
    () => new URLSearchParams(window.location.hash.slice(1)).get("link") || ""
  );

  useEffect(() => {
    // Keep the link token out of the address bar and history
    if (window.location.hash) {
      window.history.replaceState(
        null,
        "",
        window.location.pathname + window.location.search
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
      localStorage.setItem("user", JSON.stringify(result.user));

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
    <main className="auth-page">
      <div className="auth-container">
        {/* Left Side: Branding Panel */}
        <section className="auth-brand-panel">
          <div className="brand-panel-header">
            <div className="brand-panel-logo">
              <img src={typo_logo} alt="Typo AI logo" />
            </div>
            <span className="brand-panel-badge">Developer Workspace</span>
          </div>

          <div className="brand-panel-body">
            <h2>Build software faster with intelligent AI pairing.</h2>
            <p>
              Debug code, review architectures, and explore technical solutions in
              a focused workspace designed for developers.
            </p>

            <ul className="brand-features">
              <li>
                <CheckCircle2 size={16} />
                <span>Context-aware coding conversations</span>
              </li>
              <li>
                <CheckCircle2 size={16} />
                <span>Syntax highlighted multi-language answers</span>
              </li>
              <li>
                <CheckCircle2 size={16} />
                <span>Instant prompts for debugging & refactoring</span>
              </li>
            </ul>
          </div>

          <div className="brand-panel-footer">
            <Sparkles size={16} />
            <span>Built for engineering speed and precision.</span>
          </div>
        </section>

        {/* Right Side: Form Card */}
        <section className="auth-form-card">
          <header className="auth-header">
            <h1>Welcome back</h1>
            <p>Sign in to your Typo AI workspace</p>
          </header>

          <div className="auth-social-buttons">
            <button
              type="button"
              className="social-auth-btn"
              onClick={() => handleOAuthLogin("github")}
            >
              <FaGithub className="social-icon" aria-hidden="true" />
              <span>GitHub</span>
            </button>

            <button
              type="button"
              className="social-auth-btn"
              onClick={() => handleOAuthLogin("google")}
            >
              <FcGoogle className="social-icon" aria-hidden="true" />
              <span>Google</span>
            </button>
          </div>

          <div className="auth-divider">
            <span className="divider-line"></span>
            <span className="divider-text">OR CONTINUE WITH EMAIL</span>
            <span className="divider-line"></span>
          </div>

          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="form-field">
              <div className="field-label-row">
                <label htmlFor="email">Work Email</label>
              </div>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="you@company.com"
                value={formData.email}
                onChange={handleChange}
                autoComplete="email"
                required
              />
            </div>

            <div className="form-field">
              <div className="field-label-row">
                <label htmlFor="password">Password</label>
                <button
                  className="forgot-password-link"
                  type="button"
                  disabled
                  title="Password recovery is not implemented yet"
                >
                  Forgot password?
                </button>
              </div>

              <div className="password-wrapper">
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
                  className="password-toggle-btn"
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {displayedInfo && (
              <div className="auth-message auth-info" role="status">
                {displayedInfo}
              </div>
            )}

            {displayedError && (
              <div className="auth-message auth-error" role="alert">
                {displayedError}
              </div>
            )}

            <button className="auth-submit-btn" type="submit" disabled={loading}>
              <span>{loading ? "Signing in..." : "Sign in"}</span>
              {!loading && <kbd className="enter-kbd">↵ Enter</kbd>}
            </button>
          </form>

          <footer className="auth-footer">
            <span>New to Typo?</span>
            <Link to="/register">Create an account</Link>
          </footer>
        </section>
      </div>
    </main>
  );
}
