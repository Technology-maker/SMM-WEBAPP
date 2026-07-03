import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { fail } from "../utils/apiResponse.js";

export const protect = async (req, res, next) => {
  try {
    const bearer = req.headers.authorization?.startsWith("Bearer ")
      ? req.headers.authorization.split(" ")[1]
      : null;
    const token = req.cookies?.token || bearer;

    if (!token) {
      return fail(res, 401, "Authentication required");
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("-password");

    if (!user || !user.isActive) {
      return fail(res, 401, "Account is inactive or no longer exists");
    }

    req.user = user;
    next();
  } catch (error) {
    fail(res, 401, "Invalid or expired token");
  }
};
