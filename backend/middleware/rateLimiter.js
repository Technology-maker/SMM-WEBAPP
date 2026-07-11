import rateLimit from "express-rate-limit";
import { fail } from "../utils/apiResponse.js";

const handler = (req, res) => fail(res, 429, "Too many requests. Please try again later.");

export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 25,
  standardHeaders: true,
  legacyHeaders: false,
  handler
});

export const paymentLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  handler
});

export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
  handler
});

// Chat fans out to paid AI providers (Cerebras/Groq/Google/Mistral) per request,
// so it needs a tighter cap than general API traffic.
export const chatLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 6,
  standardHeaders: true,
  legacyHeaders: false,
  handler
});
