import User from "../models/User.js";
import generateToken, { setTokenCookie } from "../utils/generateToken.js";
import { ok, fail } from "../utils/apiResponse.js";

const publicUser = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  balance: user.balance,
  apiKey: user.apiKey,
  isActive: user.isActive,
  createdAt: user.createdAt
});

export const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return fail(res, 409, "Email is already registered");
    }

    const user = await User.create({ name, email, password });
    const token = generateToken(user._id);
    setTokenCookie(res, token);

    ok(res, "Registration successful", { user: publicUser(user) }, 201);
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select("+password");


    if (!user) {
      return fail(res, 401, "Invalid email or password");
    }

    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      return fail(res, 401, "Invalid email or password");
    }

    if (!user.isActive) {
      return fail(res, 403, "Your account has been disabled");
    }

    const token = generateToken(user._id);
    setTokenCookie(res, token);

    ok(res, "Login successful", { user: publicUser(user) });
  } catch (error) {
    next(error);
  }
};

export const me = async (req, res) => {
  ok(res, "Authenticated user", { user: publicUser(req.user) });
};

export const logout = async (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    secure: process.env.NODE_ENV === "production"
  });
  ok(res, "Logged out successfully");
};
