import express from "express";
import { param } from "express-validator";
import { getCategories, getCategoryById } from "../controllers/categoryController.js";
import { validate } from "../middleware/validator.js";

const router = express.Router();

router.get("/", getCategories);
router.get("/:id", [param("id").isMongoId().withMessage("Invalid category id")], validate, getCategoryById);

export default router;
