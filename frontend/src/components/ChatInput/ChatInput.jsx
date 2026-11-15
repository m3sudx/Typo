import { useState, useRef, useEffect } from "react";
import { ArrowUp } from "lucide-react";
import "./chatInput.css";

export default function ChatInput({
  onSendMessage,
  isLoading = false,
  inputPrompt = "",
}) {
  const [message, setMessage] = useState("");
  const [prevPrompt, setPrevPrompt] = useState(inputPrompt);
  const textareaRef = useRef(null);

  // Sync incoming prompt from cards / quick prompts during render
  if (inputPrompt !== prevPrompt) {
    setPrevPrompt(inputPrompt);
    if (inputPrompt) {
      setMessage(inputPrompt);
    }
  }

  // Focus textarea when prompt changes
  useEffect(() => {
    if (inputPrompt && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [inputPrompt]);

  // Auto-resize textarea
  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    textarea.style.height = "auto";
    const nextHeight = Math.min(textarea.scrollHeight, 180);
    textarea.style.height = `${Math.max(nextHeight, 24)}px`;
  }, [message]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!message.trim() || isLoading) {
      return;
    }

    onSendMessage(message.trim());
    setMessage("");

    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  };

  return (
    <div className="chat-input-wrapper">
      <form className="chat-input-form" onSubmit={handleSubmit}>
        <div className="input-box">
          <textarea
            ref={textareaRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSubmit(e);
              }
            }}
            placeholder="Ask Typo AI about your code..."
            rows={1}
            disabled={isLoading}
          />
          <button
            type="submit"
            className="send-btn"
            disabled={!message.trim() || isLoading}
            aria-label="Send prompt"
          >
            <ArrowUp size={16} />
          </button>
        </div>
      </form>
      <p className="input-hint">
        Be specific. Include code or error messages for better results.
      </p>
    </div>
  );
}
