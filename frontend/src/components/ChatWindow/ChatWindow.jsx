import { useEffect, useRef } from "react";
import UserMessage from "../UserMessage/UserMessage";
import AIMessage from "../AIMessage/AIMessage";

import "./chatWindow.css";

export default function ChatWindow({
  messages,
  isLoading,
  error,
}) {
  const bottomRef = useRef(null);

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages, isLoading]);

  return (
    <section className="chat-window">
      <div className="messages-container">

        {messages.length === 0 && !isLoading && (
          <div className="welcome-message">
            <h1>
              Good evening, {user?.name || "Developer"}.
            </h1>

            <p>
              What are you building today?
            </p>
          </div>
        )}

        {messages.map((message) => {
          if (message.role === "user") {
            return (
              <UserMessage
                key={message.id}
                message={message.content}
              />
            );
          }

          if (message.role === "assistant") {
            return (
              <AIMessage
                key={message.id}
                message={message.content}
              />
            );
          }

          return null;
        })}

        {isLoading && (
          <div className="ai-message">
            <div className="ai-message-content typing-indicator">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        )}

        {error && (
          <div className="chat-error">
            {error}
          </div>
        )}

        <div ref={bottomRef} />

      </div>
    </section>
  );
}