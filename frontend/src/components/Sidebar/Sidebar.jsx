import { useEffect, useState } from "react";
import typo_logo from "../../assets/image/typo-logo.png";

import {
  Plus,
  Search,
  Settings,
  BookOpenText,
  MessageSquare,
  UserRound,
} from "lucide-react";

import { getConversations } from "../../api/conversation.api.js";

import "./sidebar.css";

export default function Sidebar({onSelectConversation}) {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadConversations() {
      try {
        const data = await getConversations();
        setConversations(data.conversations);
      } catch (error) {
        console.error("Failed to load conversations:", error);
      } finally {
        setLoading(false);
      }
    }

    loadConversations();
  }, []);

  return (
    <aside className="sidebar">
      <header className="sidebar-header">
        <div className="logo">
          <img src={typo_logo} alt="Typo AI logo" />
        </div>

        <div className="brand-info">
          <h2>Typo AI</h2>
          <p>Developer Workspace</p>
        </div>
      </header>

      <button className="new-chat-btn">
        <Plus size={18} />
        <span>New Chat</span>
        <kbd>⌘K</kbd>
      </button>

      <button className="search-chats">
        <Search size={16} />
        <span>Search chats</span>
      </button>

      <div className="chat-history">
        <p>Recent</p>

        <section className="chat-section">
          <nav className="chat-list">
            {loading ? (
              <p>Loading...</p>
            ) : (
              conversations.map((conversation) => (
                <button
                  className="chat-item"
                  key={conversation.id}
                  onClick={() => onSelectConversation(conversation.id)}
                >
                  <MessageSquare size={15} />
                  <span>{conversation.title}</span>
                </button>
              ))
            )}
          </nav>
        </section>
      </div>

      <footer className="sidebar-footer">
        <nav className="footer-navigation">
          <button className="footer-item">
            <Settings size={17} />
            <span>Settings</span>
          </button>

          <button className="footer-item">
            <BookOpenText size={17} />
            <span>Documentation</span>
          </button>
        </nav>

        <div className="user-profile">
          <div className="avatar">
            <UserRound size={16} />
          </div>

          <div className="user-info">
            <span className="user-name">Test User</span>
            <span className="user-role">Free Developer</span>
          </div>
        </div>
      </footer>
    </aside>
  );
}
