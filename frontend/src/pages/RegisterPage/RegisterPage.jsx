import { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { FaGithub } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";

import { registerUser } from "../../api/auth.api.js";
import "./registerPage.css";

const API_URL = "http://localhost:3003/api/auth";

function RegisterPage() {
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
    oauthFailed ? "Sign-up with that provider failed. Please try again." : "",
  );
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Clear the pending redirect if the component unmounts
  useEffect(() => {
    return () => clearTimeout(redirectTimer.current);
  }, []);

  function handleChange(event) {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  // Same endpoint as login: new identity => account created, existing => signed in
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
    <main className="register-page">
      <section className="register-card">
        <div className="register-logo" aria-label="Typo logo">
          {"{↵}"}
        </div>

        <header className="register-heading">
          <h1>Create your account</h1>
          <p>Join TYPO and start building with your AI developer assistant</p>
        </header>

        <div className="register-social-buttons">
          <button type="button" onClick={() => handleOAuth("github")}>
            <FaGithub className="register-social-icon" aria-hidden="true" />
            GitHub
          </button>

          <button type="button" onClick={() => handleOAuth("google")}>
            <FcGoogle className="register-social-icon" aria-hidden="true" />
            Google
          </button>
        </div>

        <div className="register-divider">
          <span>OR CONTINUE</span>
          <span>WITH EMAIL</span>
        </div>

        <form className="register-form" onSubmit={handleSubmit}>
          <div className="register-field">
            <div className="register-label-row">
              <label htmlFor="name">Full Name</label>
              <span>Your name</span>
            </div>

            <input
              id="name"
              name="name"
              type="text"
              placeholder="Enter your name"
              value={formData.name}
              onChange={handleChange}
              autoComplete="name"
              required
            />
          </div>

          <div className="register-field">
            <div className="register-label-row">
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

          <div className="register-field">
            <div className="register-label-row">
              <label htmlFor="password">Password</label>
              <span>8+ characters</span>
            </div>

            <div className="register-password-wrapper">
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
                className="register-password-visibility"
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                aria-label={showPassword ? "Hide passwords" : "Show passwords"}
              >
                {showPassword ? "hide" : "visibility"}
              </button>
            </div>
          </div>

          <div className="register-field">
            <div className="register-label-row">
              <label htmlFor="confirmPassword">Confirm Password</label>
            </div>

            <input
              id="confirmPassword"
              name="confirmPassword"
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password again"
              value={formData.confirmPassword}
              onChange={handleChange}
              autoComplete="new-password"
              required
            />
          </div>

          {error && (
            <p className="register-message register-error" role="alert">
              {error}
            </p>
          )}

          {success && (
            <p className="register-message register-success" role="status">
              {success}
            </p>
          )}

          <button className="register-submit" type="submit" disabled={loading}>
            <span>{loading ? "Creating account..." : "Create account"}</span>

            {!loading && (
              <span className="register-enter-key">
                ↵ <kbd>Enter</kbd>
              </span>
            )}
          </button>
        </form>

        <footer className="register-footer">
          <span>Already using TYPO?</span>
          <Link to="/login">Sign in</Link>
        </footer>
      </section>
    </main>
  );
}

export default RegisterPage;