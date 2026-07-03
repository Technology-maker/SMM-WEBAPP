import Category from "../models/Category.js";
import { ok } from "../utils/apiResponse.js";

export const getCategories = async (req, res, next) => {
  try {
    const categories = await Category.find({ isActive: true }).sort({ name: 1 });
    ok(res, "Categories fetched", { categories });
  } catch (error) {
    next(error);
  }
};

export const getCategoryById = async (req, res, next) => {
  try {
    const category = await Category.findOne({ _id: req.params.id, isActive: true });
    if (!category) {
      res.status(404);
      throw new Error("Category not found");
    }
    ok(res, "Category fetched", { category });
  } catch (error) {
    next(error);
  }
};
