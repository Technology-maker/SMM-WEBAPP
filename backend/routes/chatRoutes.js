import express from "express";
import { sendChatMessage } from "../controllers/chatController.js";
import { chatLimiter } from "../middleware/rateLimiter.js";
const router = express.Router();
router.post("/", chatLimiter, sendChatMessage);
export default router;