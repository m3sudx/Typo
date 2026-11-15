import { useState } from "react";

import Sidebar from "../../components/Sidebar/Sidebar";
import ChatHeader from "../../components/ChatHeader/ChatHeader";
import ChatWindow from "../../components/ChatWindow/ChatWindow";
import ChatInput from "../../components/ChatInput/ChatInput";
import RightPanel from "../../components/RightPanel/RightPanel";

import { getMessages, createMessage } from "../../api/message.api";
import { createConversation } from "../../api/conversation.api";

import "./chatPage.css";

export default function ChatPage() {
  const [messages, setMessages] = useState([]);
  const [selectedConversationId, setSelectedConversationId] = useState(null);
  const [selectedConversationTitle, setSelectedConversationTitle] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isRightPanelOpen, setIsRightPanelOpen] = useState(true);
  const [inputPrompt, setInputPrompt] = useState("");

  const toggleRightPanel = () => setIsRightPanelOpen((prev) => !prev);

  const handlePromptSelect = (prompt) => {
    setInputPrompt(prompt);
  };

  const handleSendMessage = async (message) => {
    const temporaryUserMessage = {
      id: Date.now(),
      role: "user",
      content: message,
    };

    setError(null);
    setInputPrompt("");

    setMessages((prevMessages) => [
      ...prevMessages,
      temporaryUserMessage,
    ]);

    try {
      setIsLoading(true);

      if (!selectedConversationId) {
        const data = await createConversation(message);

        setSelectedConversationId(data.conversation.id);
        setSelectedConversationTitle(data.conversation.title || message.slice(0, 30));

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
    } catch (err) {
      console.error("Failed to send message:", err);

      setMessages((prevMessages) =>
        prevMessages.filter(
          (msg) => msg.id !== temporaryUserMessage.id
        )
      );

      setError(
        err.response?.data?.message ||
          "Something went wrong. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectConversation = async (conversationId, title = "") => {
    try {
      setSelectedConversationId(conversationId);
      if (title) {
        setSelectedConversationTitle(title);
      }

      const data = await getMessages(conversationId);

      setMessages(data.messages || []);
    } catch (err) {
      console.error("Failed to load messages:", err);
    }
  };

  const handleNewChat = () => {
    setSelectedConversationId(null);
    setSelectedConversationTitle("");
    setMessages([]);
    setInputPrompt("");
    setError(null);
  };

  return (
    <div className="chat-page">
      <Sidebar
        onSelectConversation={handleSelectConversation}
        onNewChat={handleNewChat}
        refreshKey={refreshKey}
        activeConversationId={selectedConversationId}
      />

      <main className="chat-main">
        <ChatHeader
          title={selectedConversationTitle}
          onClear={handleNewChat}
        />
        <ChatWindow
          messages={messages}
          isLoading={isLoading}
          error={error}
          onPromptSelect={handlePromptSelect}
        />
        <ChatInput
          onSendMessage={handleSendMessage}
          isLoading={isLoading}
          inputPrompt={inputPrompt}
        />
      </main>

      <RightPanel
        isOpen={isRightPanelOpen}
        toggleOpen={toggleRightPanel}
        conversationId={selectedConversationId}
        onPromptSelect={handlePromptSelect}
      />
    </div>
  );
}
