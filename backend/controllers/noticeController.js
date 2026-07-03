import Notice from "../models/Notice.js";
import { ok } from "../utils/apiResponse.js";

export const getNotices = async (req, res, next) => {
  try {
    const notices = await Notice.find({ isActive: true }).sort({ createdAt: -1 });
    ok(res, "Notices fetched", { notices });
  } catch (error) {
    next(error);
  }
};