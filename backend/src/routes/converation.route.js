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
router.get("/:id/message", getMessagesController);
router.post("/:id/message", createMessageController);

export default router;
