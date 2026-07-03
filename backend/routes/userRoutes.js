import express from "express";
import { body } from "express-validator";
import { getProfile, updateProfile, getBalance, getUserDashboard, regenerateApiKey, forgotPassword, verifyOTP, changePassword, Contactus } from "../controllers/userController.js";
import { protect } from "../middleware/authMiddleware.js";
import { validate } from "../middleware/validator.js";
import { authLimiter } from "../middleware/rateLimiter.js";

const router = express.Router();


// Public Routes
router.post(
  "/forgot-password",
  authLimiter,
  [body("email").isEmail().normalizeEmail().withMessage("Valid email is required")],
  validate,
  forgotPassword
);
router.post(
  "/verify-otp",
  authLimiter,
  [
    body("email").isEmail().normalizeEmail().withMessage("Valid email is required"),
    body("otp").trim().isLength({ min: 6, max: 6 }).withMessage("OTP code is required")
  ],
  validate,
  verifyOTP
);
router.post(
  "/change-password",
  authLimiter,
  [
    body("email").isEmail().normalizeEmail().withMessage("Valid email is required"),
    body("newPassword").isLength({ min: 6 }).withMessage("New password must be at least 6 characters"),
    body("confirmPassword").custom((value, { req }) => {
      if (value !== req.body.newPassword) {
        throw new Error("Passwords do not match");
      }
      return true;
    })
  ],
  validate,
  changePassword
);
router.post("/contact", authLimiter, Contactus);

router.use(protect);
router.get("/profile", getProfile);
router.put(
  "/profile",
  [
    body("name").optional().trim().isLength({ min: 2, max: 80 }).withMessage("Name must be 2-80 characters"),
    body("password").optional().isLength({ min: 6 }).withMessage("Password must be at least 6 characters")
  ],
  validate,
  updateProfile
);
router.get("/balance", getBalance);
router.get("/dashboard", getUserDashboard);
router.post("/api-key/regenerate", regenerateApiKey);


export default router;
