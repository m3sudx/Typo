import { useState } from "react";

import Sidebar from "../../components/Sidebar/Sidebar";
import ChatHeader from "../../components/ChatHeader/ChatHeader";
import ChatWindow from "../../components/ChatWindow/ChatWindow";
import ChatInput from "../../components/ChatInput/ChatInput";

import { getMessages, createMessage } from "../../api/message.api";
import { createConversation } from "../../api/conversation.api";

import "./chatPage.css";

export default function ChatPage() {
  const [messages, setMessages] = useState([]);
  const [selectedConversationId, setSelectedConversationId] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

const handleSendMessage = async (message) => {
  const temporaryUserMessage = {
    id: Date.now(),
    role: "user",
    content: message,
  };

  setError(null);

  setMessages((prevMessages) => [
    ...prevMessages,
    temporaryUserMessage,
  ]);

  try {
    setIsLoading(true);

    if (!selectedConversationId) {
      const data = await createConversation(message);

      setSelectedConversationId(data.conversation.id);

      setMessages((prevMessages) => [
        ...prevMessages.filter(
          (msg) => msg.id !== temporaryUserMessage.id
        ),
        data.userMessage,
        data.assistantMessage,
      ]);

      setRefreshKey((prev) => prev + 1);

      return;
    }

    const data = await createMessage(
      selectedConversationId,
      message
    );

    setMessages((prevMessages) => [
      ...prevMessages,
      data.assistantMessage,
    ]);
  } catch (error) {
    console.error("Failed to send message:", error);

    setMessages((prevMessages) =>
      prevMessages.filter(
        (msg) => msg.id !== temporaryUserMessage.id
      )
    );

    setError(
      error.response?.data?.message ||
        "Something went wrong. Please try again."
    );
  } finally {
    setIsLoading(false);
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

  const handleNewChat = () => {
    setSelectedConversationId(null);
    setMessages([]);
  };

  return (
    <div className="chat-page">
      <Sidebar
        onSelectConversation={handleSelectConversation}
        onNewChat={handleNewChat}
        refreshKey={refreshKey}
      />

      <main className="chat-main">
        <ChatHeader />
        <ChatWindow
  messages={messages}
  isLoading={isLoading}
  error={error}
/>
        <ChatInput onSendMessage={handleSendMessage} />
      </main>
    </div>
  );
}
