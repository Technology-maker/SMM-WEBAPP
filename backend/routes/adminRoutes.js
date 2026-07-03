import express from "express";
import { body, param } from "express-validator";
import { protect } from "../middleware/authMiddleware.js";
import { adminOnly } from "../middleware/adminMiddleware.js";
import { validate } from "../middleware/validator.js";
import {
  getDashboardStats,
  listUsers,
  createUser,
  updateUser,
  deleteUser,
  listServices,
  createService,
  updateService,
  deleteService,
  listCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  listNotices,
  createNotice,
  updateNotice,
  deleteNotice,
  listOrders,
  updateOrder,
  deleteOrder,
  listTransactions,
  updateTransaction,
  deleteTransaction,
  getSettings,
  updateSettings
} from "../controllers/adminController.js";

const router = express.Router();
const idParam = [param("id").isMongoId().withMessage("Invalid id")];

router.use(protect, adminOnly);
router.get("/dashboard", getDashboardStats);

router.get("/users", listUsers);
router.post(
  "/users",
  [
    body("name").trim().isLength({ min: 2, max: 80 }),
    body("email").isEmail().normalizeEmail(),
    body("password").isLength({ min: 6 }),
    body("role").optional().isIn(["user", "admin"]),
    body("balance").optional().isFloat({ min: 0 })
  ],
  validate,
  createUser
);
router.put("/users/:id", idParam, validate, updateUser);
router.delete("/users/:id", idParam, validate, deleteUser);

router.get("/services", listServices);
router.post(
  "/services",
  [
    body("name").trim().notEmpty(),
    body("category").isMongoId(),
    body("providerServiceId").trim().notEmpty(),
    body("providerName").optional().isIn(["Peakerr", "JAP", "WorldOfSMM", "Manual"]),
    body("rate").isFloat({ min: 0 }),
    body("minOrder").isInt({ min: 1 }),
    body("maxOrder").isInt({ min: 1 }),
    body("description").optional().trim(),
    body("isActive").optional().isBoolean()
  ],
  validate,
  createService
);
router.put("/services/:id", idParam, validate, updateService);
router.delete("/services/:id", idParam, validate, deleteService);

router.get("/categories", listCategories);
router.post(
  "/categories",
  [
    body("name").trim().notEmpty(),
    body("icon").optional().trim(),
    body("isActive").optional().isBoolean()
  ],
  validate,
  createCategory
);
router.put("/categories/:id", idParam, validate, updateCategory);
router.delete("/categories/:id", idParam, validate, deleteCategory);

router.get("/notices", listNotices);
router.post(
  "/notices",
  [
    body("title").trim().notEmpty(),
    body("message").trim().notEmpty(),
    body("type").optional().isIn(["info", "warning", "success", "danger"]),
    body("isActive").optional().isBoolean()
  ],
  validate,
  createNotice
);
router.put("/notices/:id", idParam, validate, updateNotice);
router.delete("/notices/:id", idParam, validate, deleteNotice);

router.get("/orders", listOrders);
router.put("/orders/:id", idParam, validate, updateOrder);
router.delete("/orders/:id", idParam, validate, deleteOrder);

router.get("/transactions", listTransactions);
router.put("/transactions/:id", idParam, validate, updateTransaction);
router.delete("/transactions/:id", idParam, validate, deleteTransaction);

router.get("/settings", getSettings);
router.put(
  "/settings",
  [
    body("siteName").optional().trim().isLength({ min: 2 }),
    body("currency").optional().trim().isLength({ min: 2, max: 6 }),
    body("minDeposit").optional().isFloat({ min: 1 }),
    body("maintenanceMode").optional().isBoolean()
  ],
  validate,
  updateSettings
);

export default router;