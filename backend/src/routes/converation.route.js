import express from "express";

import {
  getConversationsController,
  createConversationController,
  deleteConversationController,
} from "../controller/conversation.controller.js";
import {
  getMessagesController,
  createMessageController,
} from "../controller/message.controller.js";

const router = express.Router();

// Conversation routes
router.get("/", getConversationsController);
router.post("/", createConversationController);
router.delete("/:id", deleteConversationController);

// Message routes
router.get("/:id/messages", getMessagesController);
router.post("/:id/messages", createMessageController);

export default router;
