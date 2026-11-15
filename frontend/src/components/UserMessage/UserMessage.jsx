import "./userMessage.css";

export default function UserMessage({ message }) {
  return (
    <div className="user-message-row">
      <div className="user-message-bubble">
        <p>{message}</p>
      </div>
    </div>
  );
}
