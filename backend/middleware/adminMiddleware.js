import { fail } from "../utils/apiResponse.js";

export const adminOnly = (req, res, next) => {
  if (req.user?.role !== "admin") {
    return fail(res, 403, "Admin access required");
  }
  next();
};
