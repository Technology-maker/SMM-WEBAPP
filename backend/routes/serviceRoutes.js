import express from "express";
import { param, query } from "express-validator";
import { getServices, getServiceById } from "../controllers/serviceController.js";
import { validate } from "../middleware/validator.js";

const router = express.Router();

router.get(
  "/",
  [
    query("category").optional().isMongoId().withMessage("Invalid category id"),
    query("search").optional().trim().isLength({ max: 80 }).withMessage("Search is too long")
  ],
  validate,
  getServices
);
router.get("/:id", [param("id").isMongoId().withMessage("Invalid service id")], validate, getServiceById);

export default router;
