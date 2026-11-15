import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Plus,
  Search,
  MessageSquare,
  Settings,
  BookOpen,
  UserRound,
  LogOut,
} from "lucide-react";

import typo_logo from "../../assets/image/typo-logo.png";
import { getConversations } from "../../api/conversation.api.js";
import "./sidebar.css";

export default function Sidebar({
  onSelectConversation,
  onNewChat,
  refreshKey,
  activeConversationId,
}) {
  const navigate = useNavigate();
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  // Read user from localStorage
  const user = (() => {
    try {
      return JSON.parse(localStorage.getItem("user")) || { name: "Developer" };
    } catch {
      return { name: "Developer" };
    }
  })();

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("user");
    navigate("/login", { replace: true });
  };

  useEffect(() => {
    let isMounted = true;

    const loadConversations = async () => {
      try {
        const data = await getConversations();

        if (isMounted) {
          setConversations(data?.conversations ?? []);
        }
      } catch (error) {
        console.error("Failed to load conversations:", error);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadConversations();

    return () => {
      isMounted = false;
    };
  }, [refreshKey]);

  // Support Command/Ctrl+K shortcut for new chat
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        onNewChat?.();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onNewChat]);

  const filteredConversations = conversations.filter((c) =>
    (c.title || "").toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <aside className="sidebar">
      <header className="sidebar-header">
        <div className="logo-wrapper">
          <img src={typo_logo} alt="Typo AI logo" className="sidebar-logo" />
        </div>
        <div className="brand-info">
          <h2>Typo AI</h2>
          <p>Developer Workspace</p>
        </div>
      </header>

      <div className="sidebar-actions">
        <button
          className="new-chat-btn"
          onClick={onNewChat}
          title="New Conversation (⌘K)"
        >
          <Plus size={16} />
          <span>New Conversation</span>
          <kbd>⌘K</kbd>
        </button>

        {isSearching ? (
          <div className="search-input-wrapper">
            <Search size={15} className="search-icon-inside" />
            <input
              type="text"
              className="search-input"
              placeholder="Filter chats..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              autoFocus
              onBlur={() => {
                if (!searchQuery) setIsSearching(false);
              }}
            />
          </div>
        ) : (
          <button
            className="search-chats"
            onClick={() => setIsSearching(true)}
          >
            <Search size={15} />
            <span>Search conversations</span>
          </button>
        )}
      </div>

      <div className="sidebar-nav">
        <p className="nav-label">Recent</p>
        <ul className="chat-list">
          {loading ? (
            <div className="sidebar-loading">
              <span className="loading-dot"></span>
              <span className="loading-dot"></span>
              <span className="loading-dot"></span>
            </div>
          ) : filteredConversations.length === 0 ? (
            <li className="no-chats-msg">
              {searchQuery ? "No matches found" : "No conversations yet"}
            </li>
          ) : (
            filteredConversations.map((conversation) => {
              const isActive = conversation.id === activeConversationId;
              return (
                <li key={conversation.id}>
                  <button
                    className={`chat-item ${isActive ? "active" : ""}`}
                    onClick={() =>
                      onSelectConversation(conversation.id, conversation.title)
                    }
                    title={conversation.title || "Untitled Conversation"}
                  >
                    <MessageSquare size={15} className="chat-item-icon" />
                    <span className="chat-item-title">
                      {conversation.title || "Untitled Conversation"}
                    </span>
                  </button>
                </li>
              );
            })
          )}
        </ul>
      </div>

      <footer className="sidebar-footer">
        <button className="footer-item" type="button">
          <Settings size={16} />
          <span>Settings</span>
        </button>
        <button
          className="footer-item"
          type="button"
          onClick={() =>
            window.open("https://github.com", "_blank", "noopener,noreferrer")
          }
        >
          <BookOpen size={16} />
          <span>Documentation</span>
        </button>

        <div className="user-profile">
          <div className="avatar">
            <UserRound size={16} />
          </div>
          <div className="user-info">
            <span className="user-name">{user?.name || "Developer"}</span>
            <span className="user-role">Free Developer</span>
          </div>
          <button
            className="logout-btn"
            onClick={handleLogout}
            title="Sign out"
            aria-label="Sign out"
          >
            <LogOut size={16} />
          </button>
        </div>
      </footer>
    </aside>
  );
}
