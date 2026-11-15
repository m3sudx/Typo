import { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { FaGithub } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { Eye, EyeOff, Sparkles, CheckCircle2 } from "lucide-react";

import { registerUser } from "../../api/auth.api.js";
import typo_logo from "../../assets/image/typo-logo.png";
import "./registerPage.css";

const API_URL = "http://localhost:3003/api/auth";

export default function RegisterPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectTimer = useRef(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const oauthFailed = searchParams.get("oauth") === "failed";
  const [error, setError] = useState(() =>
    oauthFailed ? "Sign-up with that provider failed. Please try again." : ""
  );
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    return () => clearTimeout(redirectTimer.current);
  }, []);

  function handleChange(event) {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  function handleOAuth(provider) {
    window.location.assign(`${API_URL}/${provider}`);
  }

  async function handleSubmit(event) {
    event.preventDefault();

    setError("");
    setSuccess("");

    const { name, email, password, confirmPassword } = formData;

    if (!name.trim() || !email.trim() || !password || !confirmPassword) {
      setError("Please fill in all fields.");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);

      await registerUser({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        password,
      });

      setSuccess("Account created successfully. Redirecting to login...");

      setFormData({ name: "", email: "", password: "", confirmPassword: "" });

      redirectTimer.current = setTimeout(() => {
        navigate("/login", { replace: true });
      }, 1500);
    } catch (err) {
      const message =
        err.response?.data?.message ||
        err.response?.data?.error ||
        "Registration failed. Please try again.";

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
            <h2>Join the AI-powered developer environment.</h2>
            <p>
              Get started with Typo AI to debug complex issues, review logic, and
              accelerate your engineering workflow.
            </p>

            <ul className="brand-features">
              <li>
                <CheckCircle2 size={16} />
                <span>Zero configuration required</span>
              </li>
              <li>
                <CheckCircle2 size={16} />
                <span>Multi-turn technical chat with code execution tips</span>
              </li>
              <li>
                <CheckCircle2 size={16} />
                <span>Save and organize your engineering conversations</span>
              </li>
            </ul>
          </div>

          <div className="brand-panel-footer">
            <Sparkles size={16} />
            <span>Start building smarter today.</span>
          </div>
        </section>

        {/* Right Side: Form Card */}
        <section className="auth-form-card">
          <header className="auth-header">
            <h1>Create your account</h1>
            <p>Sign up to join Typo AI Developer Workspace</p>
          </header>

          <div className="auth-social-buttons">
            <button
              type="button"
              className="social-auth-btn"
              onClick={() => handleOAuth("github")}
            >
              <FaGithub className="social-icon" aria-hidden="true" />
              <span>GitHub</span>
            </button>

            <button
              type="button"
              className="social-auth-btn"
              onClick={() => handleOAuth("google")}
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
                <label htmlFor="name">Full Name</label>
              </div>
              <input
                id="name"
                name="name"
                type="text"
                placeholder="Ada Lovelace"
                value={formData.name}
                onChange={handleChange}
                autoComplete="name"
                required
              />
            </div>

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
                <span className="field-hint">8+ characters</span>
              </div>
              <div className="password-wrapper">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a password"
                  value={formData.password}
                  onChange={handleChange}
                  autoComplete="new-password"
                  minLength={8}
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

            <div className="form-field">
              <div className="field-label-row">
                <label htmlFor="confirmPassword">Confirm Password</label>
              </div>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type={showPassword ? "text" : "password"}
                placeholder="Confirm your password"
                value={formData.confirmPassword}
                onChange={handleChange}
                autoComplete="new-password"
                required
              />
            </div>

            {error && (
              <div className="auth-message auth-error" role="alert">
                {error}
              </div>
            )}

            {success && (
              <div className="auth-message auth-success" role="status">
                {success}
              </div>
            )}

            <button className="auth-submit-btn" type="submit" disabled={loading}>
              <span>{loading ? "Creating account..." : "Create account"}</span>
              {!loading && <kbd className="enter-kbd">↵ Enter</kbd>}
            </button>
          </form>

          <footer className="auth-footer">
            <span>Already have an account?</span>
            <Link to="/login">Sign in</Link>
          </footer>
        </section>
      </div>
    </main>
  );
}
