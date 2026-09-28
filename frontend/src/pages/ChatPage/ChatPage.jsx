import { useState } from "react";

import Sidebar from "../../components/Sidebar/Sidebar";
import ChatHeader from "../../components/ChatHeader/ChatHeader";
import ChatWindow from "../../components/ChatWindow/ChatWindow";
import ChatInput from "../../components/ChatInput/ChatInput";

import "./chatPage.css";

export default function ChatPage() {
  const [messages, setMessages] = useState([]);

  const handleSendMessage = (message) => {
    const newMessage = {
      id: Date.now(),
      role: "user",
      content: message,
    };

    setMessages((prevMessages) => [
      ...prevMessages,
      newMessage,
    ]);
  };

  return (
    <div className="chat-page">
      <Sidebar />

      <main className="chat-main">
        <ChatHeader />
        <ChatWindow messages={messages} />
        <ChatInput onSendMessage={handleSendMessage} />
      </main>
    </div>
  );
}