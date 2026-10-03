import api from "./axios.js";

export async function getConversations() {
  const response = await api.get("/conversations");
  return response.data;
}

export async function createConversation(firstMessage) {
  const response = await api.post("/conversations", {
    firstMessage,
  });

  return response.data;
}

export async function deleteConversation(conversationId) {
  const response = await api.delete(`/conversations/${conversationId}`);
  return response.data;
}