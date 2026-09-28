import { createMessageService ,getMessagesService } from "../service/message.service.js";

export async function createMessageController(req, res, next) {
  try {
    const { id } = req.params;
    const { content } = req.body;

    if (!/^\d+$/.test(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid conversation ID",
      });
    }

    if (typeof content !== "string" || !content.trim()) {
      return res.status(400).json({
        success: false,
        message: "Message content is required",
      });
    }

    const userId = 2; // Temporary test user ID

    const result = await createMessageService(
      userId,
      Number(id),
      content.trim()
    );

    if (!result) {
      return res.status(404).json({
        success: false,
        message: "Conversation not found",
      });
    }

    return res.status(201).json({
      success: true,
      userMessage: result.userMessage,
      assistantMessage: result.assistantMessage,
    });
  } catch (error) {
    next(error);
  }
}

export async function getMessagesController(req, res, next) {
  try {
    const { conversationId } = req.params;

    if (!/^\d+$/.test(conversationId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid conversation ID",
      });
    }

    const userId = 2; // Temporary test user ID

    const messages = await getMessagesService(
      userId,
      Number(conversationId)
    );

    if (messages === null) {
      return res.status(404).json({
        success: false,
        message: "Conversation not found",
      });
    }

    return res.status(200).json({
      success: true,
      messages,
    });
  } catch (error) {
    next(error);
  }
}