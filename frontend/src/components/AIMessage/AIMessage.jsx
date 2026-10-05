import "./aiMessage.css";

export default function AIMessage({ message }) {
  return (
    <div className="ai-message">
      <div className="ai-message-content">
        <p>{message}</p>
      </div>

    </div>
  );
}