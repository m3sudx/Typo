import { useState } from "react";

import Sidebar from "../../components/Sidebar/Sidebar";
import ChatHeader from "../../components/ChatHeader/ChatHeader";
import ChatWindow from "../../components/ChatWindow/ChatWindow";
import ChatInput from "../../components/ChatInput/ChatInput";

import {
  getMessages,
  createMessage,
} from "../../api/message.api";

import "./chatPage.css";

export default function ChatPage() {
  const [messages, setMessages] = useState([]);
  const [selectedConversationId, setSelectedConversationId] = useState(null);

  const handleSendMessage = async (message) => {
    if (!selectedConversationId) {
      return;
    }

    try {
      const data = await createMessage(
        selectedConversationId,
        message
      );

      setMessages((prevMessages) => [
        ...prevMessages,
        data.userMessage,
        data.assistantMessage,
      ]);
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  const handleSelectConversation = async (conversationId) => {
    try {
      setSelectedConversationId(conversationId);

      const data = await getMessages(conversationId);

      setMessages(data.messages);
    } catch (error) {
      console.error("Failed to load messages:", error);
    }
  };

  return (
    <div className="chat-page">
      <Sidebar onSelectConversation={handleSelectConversation} />

      <main className="chat-main">
        <ChatHeader />
        <ChatWindow messages={messages} />
        <ChatInput onSendMessage={handleSendMessage} />
      </main>
    </div>
  );
}