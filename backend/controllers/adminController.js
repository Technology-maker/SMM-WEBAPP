import User from "../models/User.js";
import Order from "../models/Order.js";
import Service from "../models/Service.js";
import Category from "../models/Category.js";
import Notice from "../models/Notice.js";
import Transaction from "../models/Transaction.js";
import Settings from "../models/Settings.js";
import { ok, fail } from "../utils/apiResponse.js";

const paginate = (req) => {
  const page = Math.max(Number(req.query.page) || 1, 1);
  const limit = Math.min(Math.max(Number(req.query.limit) || 20, 1), 100);
  return { page, limit, skip: (page - 1) * limit };
};

export const getDashboardStats = async (req, res, next) => {
  try {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
    sevenDaysAgo.setHours(0, 0, 0, 0);

    const [
      users,
      activeUsers,
      orders,
      pendingOrders,
      revenue,
      deposits,
      ordersPerDay,
      topServices
    ] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ isActive: true }),
      Order.countDocuments(),
      Order.countDocuments({ status: { $in: ["pending", "processing"] } }),
      Order.aggregate([{ $group: { _id: null, total: { $sum: "$charge" } } }]),
      Transaction.aggregate([
        { $match: { type: "deposit", status: "success" } },
        { $group: { _id: null, total: { $sum: "$amount" } } }
      ]),
      Order.aggregate([
        { $match: { createdAt: { $gte: sevenDaysAgo } } },
        {
          $group: {
            _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
            orders: { $sum: 1 },
            revenue: { $sum: "$charge" }
          }
        },
        { $sort: { _id: 1 } }
      ]),
      Order.aggregate([
        { $group: { _id: "$serviceId", orders: { $sum: 1 }, revenue: { $sum: "$charge" } } },
        { $sort: { orders: -1 } },
        { $limit: 5 },
        { $lookup: { from: "services", localField: "_id", foreignField: "_id", as: "service" } },
        { $unwind: "$service" },
        { $project: { name: "$service.name", orders: 1, revenue: 1 } }
      ])
    ]);

    ok(res, "Admin dashboard fetched", {
      stats: {
        users,
        activeUsers,
        orders,
        pendingOrders,
        revenue: revenue[0]?.total || 0,
        deposits: deposits[0]?.total || 0
      },
      charts: { ordersPerDay, topServices }
    });
  } catch (error) {
    next(error);
  }
};

export const listUsers = async (req, res, next) => {
  try {
    const { page, limit, skip } = paginate(req);
    const search = req.query.search;
    const filter = search
      ? { $or: [{ name: { $regex: search, $options: "i" } }, { email: { $regex: search, $options: "i" } }] }
      : {};
    const [users, total] = await Promise.all([
      User.find(filter).select("-password").sort({ createdAt: -1 }).skip(skip).limit(limit),
      User.countDocuments(filter)
    ]);
    ok(res, "Users fetched", { users, total, page, pages: Math.ceil(total / limit) || 1 });
  } catch (error) {
    next(error);
  }
};

export const createUser = async (req, res, next) => {
  try {
    const { name, email, password, role, balance, isActive } = req.body;

    // ── Validation checks ──────────────────────────────────────
    if (!name || name.trim().length < 3) {
      return fail(res, 400, "Name must be at least 3 characters");
    }

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return fail(res, 400, "Enter a valid email address");
    }

    if (!password || password.length < 6) {
      return fail(res, 400, "Password must be at least 6 characters");
    }

    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      return fail(res, 409, "Email already exists");
    }

    // ── Create user ────────────────────────────────────────────
    const created = await User.create({ name, email, password, role, balance, isActive });
    const user = await User.findById(created._id).select("-password");
    ok(res, "User created", { user }, 201);
  } catch (error) {
    next(error);
  }
};

export const updateUser = async (req, res, next) => {
  try {
    const allowed = ["name", "email", "role", "balance", "isActive", "password"];
    const updates = Object.fromEntries(Object.entries(req.body).filter(([key]) => allowed.includes(key)));
    const user = await User.findById(req.params.id).select("+password");
    if (!user) return fail(res, 404, "User not found");
    Object.assign(user, updates);
    await user.save();
    const cleanUser = await User.findById(user._id).select("-password");
    ok(res, "User updated", { user: cleanUser });
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (req, res, next) => {
  try {
    // 1. Check permissions FIRST before touching the database
    if (req.params.id === String(req.user._id)) {
      return fail(res, 400, "You cannot delete your own account");
    }

    // 2. Safely proceed with deletion
    const user = await User.findByIdAndDelete(req.params.id);

    // 3. Check if the user actually existed
    if (!user) {
      return fail(res, 404, "User not found");
    }

    // 4. Return success
    return ok(res, "User deleted");
  } catch (error) {
    next(error);
  }
};

export const listServices = async (req, res, next) => {
  try {
    const services = await Service.find().populate("category", "name icon").sort({ createdAt: -1 });
    ok(res, "Services fetched", { services });
  } catch (error) {
    next(error);
  }
};

export const createService = async (req, res, next) => {
  try {
    const service = await Service.create(req.body);
    const populated = await Service.findById(service._id).populate("category", "name icon");
    ok(res, "Service created", { service: populated }, 201);
  } catch (error) {
    next(error);
  }
};

export const updateService = async (req, res, next) => {
  try {
    const service = await Service.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
      .populate("category", "name icon");
    if (!service) return fail(res, 404, "Service not found");
    ok(res, "Service updated", { service });
  } catch (error) {
    next(error);
  }
};

export const deleteService = async (req, res, next) => {
  try {
    const service = await Service.findByIdAndDelete(req.params.id);
    if (!service) return fail(res, 404, "Service not found");
    ok(res, "Service deleted");
  } catch (error) {
    next(error);
  }
};

export const listCategories = async (req, res, next) => {
  try {
    const categories = await Category.find().sort({ name: 1 });
    ok(res, "Categories fetched", { categories });
  } catch (error) {
    next(error);
  }
};

export const createCategory = async (req, res, next) => {
  try {
    const category = await Category.create(req.body);
    ok(res, "Category created", { category }, 201);
  } catch (error) {
    next(error);
  }
};

export const updateCategory = async (req, res, next) => {
  try {
    const category = await Category.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!category) return fail(res, 404, "Category not found");
    ok(res, "Category updated", { category });
  } catch (error) {
    next(error);
  }
};

export const deleteCategory = async (req, res, next) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category) return fail(res, 404, "Category not found");
    ok(res, "Category deleted");
  } catch (error) {
    next(error);
  }
};

export const listNotices = async (req, res, next) => {
  try {
    const notices = await Notice.find().sort({ createdAt: -1 });
    ok(res, "Notices fetched", { notices });
  } catch (error) {
    next(error);
  }
};

export const createNotice = async (req, res, next) => {
  try {
    const notice = await Notice.create(req.body);
    ok(res, "Notice created", { notice }, 201);
  } catch (error) {
    next(error);
  }
};

export const updateNotice = async (req, res, next) => {
  try {
    const notice = await Notice.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!notice) return fail(res, 404, "Notice not found");
    ok(res, "Notice updated", { notice });
  } catch (error) {
    next(error);
  }
};

export const deleteNotice = async (req, res, next) => {
  try {
    const notice = await Notice.findByIdAndDelete(req.params.id);
    if (!notice) return fail(res, 404, "Notice not found");
    ok(res, "Notice deleted");
  } catch (error) {
    next(error);
  }
};

export const listOrders = async (req, res, next) => {
  try {
    const { page, limit, skip } = paginate(req);
    const filter = req.query.status ? { status: req.query.status } : {};
    const [orders, total] = await Promise.all([
      Order.find(filter)
        .populate("userId", "name email")
        .populate("serviceId", "name rate")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Order.countDocuments(filter)
    ]);
    ok(res, "Orders fetched", { orders, total, page, pages: Math.ceil(total / limit) || 1 });
  } catch (error) {
    next(error);
  }
};

export const updateOrder = async (req, res, next) => {
  try {
    const allowed = ["status", "startCount", "remains", "providerOrderId", "providerError"];
    const updates = Object.fromEntries(Object.entries(req.body).filter(([key]) => allowed.includes(key)));
    const existing = await Order.findById(req.params.id);
    if (!existing) return fail(res, 404, "Order not found");

    const order = await Order.findByIdAndUpdate(req.params.id, updates, { new: true, runValidators: true })
      .populate("userId", "name email")
      .populate("serviceId", "name rate");
    if (!order) return fail(res, 404, "Order not found");

    // Refund on cancellation (once only)
    if (updates.status === "cancelled" && existing.status !== "cancelled" && !order.refunded) {
      await User.findByIdAndUpdate(order.userId._id, { $inc: { balance: order.charge } });
      await Transaction.create({
        userId: order.userId._id,
        type: "deposit",
        amount: order.charge,
        method: "refund",
        status: "success",
        reference: `REFUND-${order._id}`,
        meta: { orderId: order._id }
      });
      order.refunded = true;
      await order.save();
    }

    // Partial refund proportional to what wasn't delivered
    if (updates.status === "partial" && existing.status !== "partial" && !order.refunded) {
      const undelivered = order.remains || 0;
      const refundAmount = Number(((order.charge / order.quantity) * undelivered).toFixed(2));
      if (refundAmount > 0) {
        await User.findByIdAndUpdate(order.userId._id, { $inc: { balance: refundAmount } });
        await Transaction.create({
          userId: order.userId._id,
          type: "deposit",
          amount: refundAmount,
          method: "partial_refund",
          status: "success",
          reference: `REFUND-${order._id}`,
          meta: { orderId: order._id }
        });
        order.refunded = true;
        await order.save();
      }
    }

    ok(res, "Order updated", { order });
  } catch (error) {
    next(error);
  }
};

export const deleteOrder = async (req, res, next) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);
    if (!order) return fail(res, 404, "Order not found");
    ok(res, "Order deleted");
  } catch (error) {
    next(error);
  }
};

export const listTransactions = async (req, res, next) => {
  try {
    const { page, limit, skip } = paginate(req);
    const filter = req.query.status ? { status: req.query.status } : {};
    const [transactions, total] = await Promise.all([
      Transaction.find(filter).populate("userId", "name email").sort({ createdAt: -1 }).skip(skip).limit(limit),
      Transaction.countDocuments(filter)
    ]);
    ok(res, "Transactions fetched", { transactions, total, page, pages: Math.ceil(total / limit) || 1 });
  } catch (error) {
    next(error);
  }
};

export const updateTransaction = async (req, res, next) => {
  try {
    // ✅ Fetch BEFORE update to check previous status
    const transaction = await Transaction.findById(req.params.id);
    if (!transaction) return fail(res, 404, "Transaction not found");

    const wasAlreadySuccess = transaction.status === "success";

    // ✅ Apply updates manually (safe, controlled)
    const { status, method, amount, utr } = req.body;
    if (status !== undefined) transaction.status = status;
    if (method !== undefined) transaction.method = method;
    if (amount !== undefined) transaction.amount = Number(amount);
    if (utr !== undefined) transaction.utr = utr?.trim() || null;

    await transaction.save();

    // ✅ Credit wallet when deposit approved
    if (status === "success" && !wasAlreadySuccess && transaction.type === "deposit") {
      await User.findByIdAndUpdate(
        transaction.userId,
        { $inc: { balance: transaction.amount } }
      );
    }

    // ✅ Reverse credit if admin un-approves a deposit
    if (wasAlreadySuccess && status !== "success" && transaction.type === "deposit") {
      await User.findByIdAndUpdate(
        transaction.userId,
        { $inc: { balance: -transaction.amount } }
      );
    }

    ok(res, "Transaction updated", { transaction });
  } catch (error) {
    next(error);
  }
};

export const deleteTransaction = async (req, res, next) => {
  try {
    const transaction = await Transaction.findByIdAndDelete(req.params.id);
    if (!transaction) return fail(res, 404, "Transaction not found");
    ok(res, "Transaction deleted");
  } catch (error) {
    next(error);
  }
};

export const getSettings = async (req, res, next) => {
  try {
    const settings = await Settings.findOneAndUpdate(
      {},
      { $setOnInsert: { siteName: "SMM Pulse" } },
      { new: true, upsert: true }
    );
    ok(res, "Settings fetched", { settings });
  } catch (error) {
    next(error);
  }
};

export const updateSettings = async (req, res, next) => {
  try {
    const settings = await Settings.findOneAndUpdate({}, req.body, { new: true, upsert: true, runValidators: true });
    ok(res, "Settings updated", { settings });
  } catch (error) {
    next(error);
  }
};
