import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Share2, Trash2, LogOut, Check } from "lucide-react";

import "./chatHeader.css";

export default function ChatHeader({ title, onClear }) {
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("user");
    navigate("/login", { replace: true });
  };

  return (
    <header className="chat-header">
      <div className="header-left">
        <span className="breadcrumb">Typo AI / </span>
        <span className="conversation-title">{title || "New Conversation"}</span>
      </div>

      <div className="header-actions">
        <button
          className="header-action-btn"
          onClick={handleShare}
          title="Share conversation link"
        >
          {copied ? <Check size={15} /> : <Share2 size={15} />}
          <span>{copied ? "Copied" : "Share"}</span>
        </button>

        <button
          className="header-action-btn"
          onClick={onClear}
          title="Clear current conversation"
        >
          <Trash2 size={15} />
          <span>Clear</span>
        </button>

        <button
          className="header-action-btn logout"
          onClick={handleLogout}
          title="Sign out"
          aria-label="Sign out"
        >
          <LogOut size={15} />
        </button>
      </div>
    </header>
  );
}
