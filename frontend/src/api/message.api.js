import api from "./axios.js";

export async function getMessages(conversationId) {
  const response = await api.get(
    `/conversations/${conversationId}/messages`
  );

  return response.data;
}

export async function createMessage(conversationId, content) {
  const response = await api.post(
    `/conversations/${conversationId}/messages`,
    {
      content,
    }
  );

  return response.data;
}

