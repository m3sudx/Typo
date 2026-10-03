import express from "express";

import {
  createConversationController,
  getConversationsController,
  deleteConversationController,
} from "../controller/conversation.controller.js";

import {
  getMessagesController,
  createMessageController,
} from "../controller/message.controller.js";

import { requireAuth } from "../middleware/auth.js";

const router = express.Router();

router.use(requireAuth);

router.get("/", getConversationsController);
router.post("/", createConversationController);
router.delete("/:id", deleteConversationController);
router.get("/:id/messages", getMessagesController);
router.post("/:id/messages", createMessageController);

export default router;
