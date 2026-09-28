import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

export default function OAuthCallback() {
  const navigate = useNavigate();
  const handled = useRef(false);

  useEffect(() => {
    if (handled.current) return; // StrictMode runs effects twice in dev
    handled.current = true;

    const token = new URLSearchParams(window.location.hash.slice(1)).get("token");

    // Remove the token from the URL / history
    window.history.replaceState(null, "", window.location.pathname);

    if (token) {
      localStorage.setItem("access_token", token);
      navigate("/chat", { replace: true });
    } else {
      navigate("/login?oauth=failed", { replace: true });
    }
  }, [navigate]);

  return null;
}