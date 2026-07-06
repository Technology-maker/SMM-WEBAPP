import Order from "../models/Order.js";
import Service from "../models/Service.js";
import Transaction from "../models/Transaction.js";
import User from "../models/User.js";
import { getProvider } from "../providers/index.js";
import { ok, fail } from "../utils/apiResponse.js";

const calculateCharge = (rate, quantity) => Number(((rate * quantity) / 1000).toFixed(2));

const normalizeProviderStatus = (status) => {
  const value = String(status || "").toLowerCase();
  if (value.includes("complete")) return "completed";
  if (value.includes("process") || value.includes("progress")) return "processing";
  if (value.includes("cancel")) return "cancelled";
  if (value.includes("partial")) return "partial";
  return "pending";
};

export const createOrder = async (req, res, next) => {
  try {
    const { serviceId, link, quantity } = req.body;
    const service = await Service.findOne({ _id: serviceId, isActive: true });

    if (!service) return fail(res, 404, "Service not found");

    const numericQuantity = Number(quantity);
    if (numericQuantity < service.minOrder || numericQuantity > service.maxOrder) {
      return fail(res, 400, `Quantity must be between ${service.minOrder} and ${service.maxOrder}`);
    }

    const charge = calculateCharge(service.rate, numericQuantity);

    // Atomically check balance and deduct to prevent race conditions / double-spend
    const updatedUser = await User.findOneAndUpdate(
      { _id: req.user._id, balance: { $gte: charge } },
      { $inc: { balance: -charge } },
      { new: true }
    );

    if (!updatedUser) {
      return fail(res, 400, "Insufficient balance");
    }

    let providerOrderId = "";
    let providerError = "";
    let status = service.providerName === "Manual" ? "pending" : "processing";

    if (service.providerName !== "Manual") {
      const provider = getProvider(service.providerName);

      if (!provider) {
        status = "pending";
        providerError = `Unknown provider "${service.providerName}". Order queued for manual processing.`;
      } else {
        try {
          const providerResult = await provider.createOrder(service.providerServiceId, link, numericQuantity);
          providerOrderId = String(providerResult.order || providerResult.id || "");
        } catch (error) {
          status = "pending";
          providerError = error.code === "PROVIDER_NOT_CONFIGURED"
            ? `${provider.label} API key is not configured. Order queued for manual processing.`
            : `Provider unavailable: ${error.message}`;
        }
      }
    }

    let order;
    try {
      order = await Order.create({
        userId: req.user._id,
        serviceId: service._id,
        link,
        quantity: numericQuantity,
        charge,
        status,
        remains: numericQuantity,
        providerOrderId,
        providerError
      });
    } catch (err) {
      await User.findByIdAndUpdate(req.user._id, { $inc: { balance: charge } });
      throw err;
    }

    await Transaction.create({
      userId: req.user._id,
      type: "debit",
      amount: charge,
      method: "order",
      status: "success",
      reference: `ORDER-${order._id}`,
      meta: { orderId: order._id, serviceId: service._id }
    });

    const populatedOrder = await Order.findById(order._id).populate("serviceId", "name rate");
    ok(res, providerError || "Order created successfully", { order: populatedOrder, balance: updatedUser.balance }, 201);
  } catch (error) {
    next(error);
  }
};

// get my order controller 
export const getMyOrders = async (req, res, next) => {
  try {
    const page = Math.max(Number(req.query.page) || 1, 1);
    const limit = Math.min(Math.max(Number(req.query.limit) || 10, 1), 50);
    const search = req.query.search;
    const filter = { userId: req.user._id };

    if (search) {
      filter.$or = [
        { link: { $regex: search, $options: "i" } },
        { status: { $regex: search, $options: "i" } }
      ];
    }

    const [orders, total] = await Promise.all([
      Order.find(filter)
        .populate("serviceId", "name rate providerName")
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit),
      Order.countDocuments(filter)
    ]);

    const SYNC_INTERVAL_MS = 3 * 60 * 1000; // 5 minutes
    await Promise.all(
      orders
        .filter(o => o.providerOrderId && o.status !== "completed" &&
          (!o.lastSyncedAt || Date.now() - o.lastSyncedAt.getTime() > SYNC_INTERVAL_MS))
        .map(async (order) => {
          const provider = getProvider(order.serviceId?.providerName);
          if (!provider) return;
          try {
            const providerStatus = await provider.getOrderStatus(order.providerOrderId);
            order.status = normalizeProviderStatus(providerStatus.status);
            order.startCount = Number(providerStatus.start_count || order.startCount || 0);
            order.remains = Number(providerStatus.remains || order.remains || 0);
            order.lastSyncedAt = new Date();
            await order.save();
          } catch (error) {
            order.providerError = `Status sync failed: ${error.message}`;
            await order.save();
          }
        })
    );

    ok(res, "Orders fetched", { orders, total, page, pages: Math.ceil(total / limit) || 1 });
  } catch (error) {
    next(error);
  }
};

// get order by id controller 
export const getOrderById = async (req, res, next) => {
  try {
    const filter = { _id: req.params.id };
    if (req.user.role !== "admin") filter.userId = req.user._id;

    const order = await Order.findOne(filter).populate("serviceId", "name rate providerName").populate("userId", "name email");
    if (!order) return fail(res, 404, "Order not found");

    const SYNC_INTERVAL_MS = 5 * 60 * 1000; // 5 minutes
    const shouldSync =
      order.providerOrderId &&
      order.status !== "completed" &&
      (!order.lastSyncedAt || Date.now() - order.lastSyncedAt.getTime() > SYNC_INTERVAL_MS);

    if (shouldSync) {
      const provider = getProvider(order.serviceId?.providerName);

      if (provider) {
        try {
          const providerStatus = await provider.getOrderStatus(order.providerOrderId);
          order.status = normalizeProviderStatus(providerStatus.status);
          order.startCount = Number(providerStatus.start_count || order.startCount || 0);
          order.remains = Number(providerStatus.remains || order.remains || 0);
          order.lastSyncedAt = new Date();
          await order.save();
        } catch (error) {
          order.providerError = `Status sync failed: ${error.message}`;
          await order.save();
        }
      }
    }

    ok(res, "Order fetched", { order });
  } catch (error) {
    next(error);
  }
}