import express from "express";
import { body } from "express-validator";
import { createDeposit, verifyPayment, getMyTransactions , getDepositSettings } from "../controllers/paymentController.js";
import { protect } from "../middleware/authMiddleware.js";
import { paymentLimiter } from "../middleware/rateLimiter.js";
import { validate } from "../middleware/validator.js";

const router = express.Router();

router.use(protect);

router.get("/my", getMyTransactions);
router.get("/deposit-settings", getDepositSettings);

router.post(
  "/deposit",
  paymentLimiter,
  [
    body("amount").isFloat({ min: 1 , max: 50000 }).withMessage("Amount must be greater than zero"),
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
