import "./userMessage.css";

export default function UserMessage({ message }) {
  return (
    <div className="user-message">
      <div className="user-message-content">
        <p>{message}</p>
      </div>
    </div>
  );
}
