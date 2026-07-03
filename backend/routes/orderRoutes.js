import express from "express";
import { body, param, query } from "express-validator";
import { createOrder, getMyOrders, getOrderById } from "../controllers/orderController.js";
import { protect } from "../middleware/authMiddleware.js";
import { validate } from "../middleware/validator.js";

const router = express.Router();

router.use(protect);
router.post(
  "/new",
  [
    body("serviceId").isMongoId().withMessage("Valid service is required"),
    body("link").trim().isURL({ require_protocol: true, protocols: ["http", "https"] }).withMessage("A valid http/https URL is required"),
    body("quantity").isInt({ min: 1 }).withMessage("Quantity must be at least 1")
  ],
  validate,
  createOrder
);
router.get(
  "/my",
  [
    query("page").optional().isInt({ min: 1 }),
    query("limit").optional().isInt({ min: 1, max: 50 }),
    query("search").optional().trim().isLength({ max: 120 })
  ],
  validate,
  getMyOrders
);
router.get("/:id", [param("id").isMongoId().withMessage("Invalid order id")], validate, getOrderById);

export default router;
