import { useEffect, useRef } from "react";
import UserMessage from "../UserMessage/UserMessage";
import AIMessage from "../AIMessage/AIMessage";
import WelcomeScreen from "../WelcomeScreen/WelcomeScreen";

import "./chatWindow.css";

export default function ChatWindow({
  messages = [],
  isLoading = false,
  error = null,
  onPromptSelect,
}) {
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages, isLoading]);

  return (
    <section className="chat-window">
      <div className="messages-container">
        {messages.length === 0 && !isLoading ? (
          <WelcomeScreen onPromptSelect={onPromptSelect} />
        ) : (
          <div className="messages-list">
            {messages.map((message, idx) => {
              const messageKey = message.id ?? `msg-${idx}`;

              if (message.role === "user") {
                return (
                  <UserMessage
                    key={messageKey}
                    message={message.content}
                  />
                );
              }

              if (message.role === "assistant") {
                return (
                  <AIMessage
                    key={messageKey}
                    message={message.content}
                  />
                );
              }

              return null;
            })}

            {isLoading && (
              <div className="ai-message-loading">
                <div className="typing-indicator" aria-label="Typo AI is thinking">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            )}

            {error && (
              <div className="chat-error" role="alert">
                {error}
              </div>
            )}

            <div ref={bottomRef} />
          </div>
        )}
      </div>
    </section>
  );
}
