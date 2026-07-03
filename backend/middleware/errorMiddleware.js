import { fail } from "../utils/apiResponse.js";

export const notFound = (req, res, next) => {
  const error = new Error(`Route not found: ${req.originalUrl}`);
  res.status(404);
  next(error);
};

export const errorHandler = (err, req, res, next) => {
  const statusCode = res.statusCode && res.statusCode !== 200 ? res.statusCode : 500;
  const message = err.message || "Server error";

  if (process.env.NODE_ENV !== "test") {
    console.error(message);
  }

  fail(res, statusCode, message, process.env.NODE_ENV === "production" ? null : { stack: err.stack });
};
