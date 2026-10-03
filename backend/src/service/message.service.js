import pool from "../config/db.js";
import { generateTypoResponse } from "./gemini.service.js";

export async function createMessageService(
  userId,
  conversationId,
  content
) {
  // 1. Save the user's new message
  const userMessageResult = await pool.query(
    `INSERT INTO messages (conversation_id, role, content)
     SELECT c.id, $3, $4
     FROM conversations c
     WHERE c.id = $1 AND c.user_id = $2
     RETURNING id, conversation_id, role, content, created_at`,
    [conversationId, userId, "user", content]
  );

  const userMessage = userMessageResult.rows[0];

  // Conversation doesn't exist or doesn't belong to this user
  if (!userMessage) {
    return null;
  }

  // 2. Get conversation history, including the new user message
  const messages = await getMessagesService(
    userId,
    conversationId
  );

  // 3. Generate Typo's response using the conversation history
  const answer = await generateTypoResponse(messages);

  // 4. Save Typo's response
  const assistantMessageResult = await pool.query(
    `INSERT INTO messages (conversation_id, role, content)
     VALUES ($1, $2, $3)
     RETURNING id, conversation_id, role, content, created_at`,
    [conversationId, "assistant", answer]
  );

  const assistantMessage = assistantMessageResult.rows[0];

  // 5. Update conversation's last activity time
await pool.query(
  `UPDATE conversations
   SET updated_at = CURRENT_TIMESTAMP
   WHERE id = $1 AND user_id = $2`,
  [conversationId, userId]
);

  return {
    userMessage,
    assistantMessage,
  };
}

export async function getMessagesService(userId, conversationId) {
  // Check that the conversation belongs to this user
  const conversationResult = await pool.query(
    `SELECT id
     FROM conversations
     WHERE id = $1 AND user_id = $2`,
    [conversationId, userId]
  );

  if (conversationResult.rows.length === 0) {
    return null;
  }

  // Get messages in chronological order
  const result = await pool.query(
    `SELECT id, conversation_id, role, content, created_at
     FROM messages
     WHERE conversation_id = $1
     ORDER BY created_at ASC, id ASC`,
    [conversationId]
  );

  return result.rows;
}