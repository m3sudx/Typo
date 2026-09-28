import pool from "../config/db.js";
import { generateConversationTitle,generateTypoResponse } from "./gemini.service.js";

export async function getConversationsService(userId) {
  const result = await pool.query(
    `SELECT id, user_id, title, created_at, updated_at
     FROM conversations
     WHERE user_id = $1
     ORDER BY updated_at DESC`,
    [userId],
  );

  return result.rows;
}


export async function createConversationService(userId, firstMessage) {
  // 1. Generate the conversation title
  const title = await generateConversationTitle(firstMessage);

  // 2. Generate Typo's first response using the same first message
  const answer = await generateTypoResponse([
    {
      role: "user",
      content: firstMessage,
    },
  ]);

  // 3. Save the conversation and both messages
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const conversationResult = await client.query(
      `INSERT INTO conversations (user_id, title)
       VALUES ($1, $2)
       RETURNING id, user_id, title, created_at, updated_at`,
      [userId, title]
    );

    const conversation = conversationResult.rows[0];

    const userMessageResult = await client.query(
      `INSERT INTO messages (conversation_id, role, content)
       VALUES ($1, $2, $3)
       RETURNING id, conversation_id, role, content, created_at`,
      [conversation.id, "user", firstMessage]
    );

    const userMessage = userMessageResult.rows[0];

    const assistantMessageResult = await client.query(
      `INSERT INTO messages (conversation_id, role, content)
       VALUES ($1, $2, $3)
       RETURNING id, conversation_id, role, content, created_at`,
      [conversation.id, "assistant", answer]
    );

    const assistantMessage = assistantMessageResult.rows[0];

    await client.query("COMMIT");

    return {
      conversation,
      userMessage,
      assistantMessage,
    };
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}

export async function deleteConversationService(userId, id) {
  const result = await pool.query(
    `DELETE FROM conversations
     WHERE id = $1 AND user_id = $2
     RETURNING id`,
    [id, userId]
  );

  return result.rows[0] ?? null;
}