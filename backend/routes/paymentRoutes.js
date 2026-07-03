import express from "express";
import { body } from "express-validator";
import { createDeposit, verifyPayment, getMyTransactions } from "../controllers/paymentController.js";
import { protect } from "../middleware/authMiddleware.js";
import { paymentLimiter } from "../middleware/rateLimiter.js";
import { validate } from "../middleware/validator.js";

const router = express.Router();

router.use(protect);

router.get("/my", getMyTransactions);

router.post(
  "/deposit",
  paymentLimiter,
  [
    body("amount").isFloat({ min: 1 }).withMessage("Amount must be greater than zero"),
    body("method").optional().isIn(["upi", "manual", "bhim_upi"]).withMessage("Unsupported payment method")
  ],
  validate,
  createDeposit
);
router.post(
  "/verify",
  paymentLimiter,
  [
    body("reference").trim().notEmpty().withMessage("Reference is required")
  ],
  validate,
  verifyPayment
);

export default router;
