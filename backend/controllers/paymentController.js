import Settings from "../models/Settings.js";
import Transaction from "../models/Transaction.js";
import User from "../models/User.js";
import { ok, fail } from "../utils/apiResponse.js";



export const createDeposit = async (req, res, next) => {
  try {
    const amount = Number(req.body.amount);
    const method = req.body.method || "Manual";
    const utr = req.body.utr?.trim() || null; // ✅ NEW

    const settings = await Settings.findOne();
    const minDeposit = settings?.minDeposit || 100;

    if (amount < minDeposit) {
      return fail(res, 400, `Minimum deposit is ${minDeposit}`);
    }

    // ✅ UTR required for manual/upi
    if ((method === "upi" || method === "manual" || method === "bhim_upi") && !utr) {
      return fail(res, 400, "UTR / Transaction ID is required for manual payment");
    }

    // ✅ UTR length validation
    if (utr && utr.length < 12) {
      return fail(res, 400, "Enter a valid UTR ID");
    }

    // ✅ Duplicate UTR check
    if (utr) {
      const existing = await Transaction.findOne({ utr });
      if (existing) return fail(res, 400, "UTR already submitted(Wait 10 min)");
    }

    const reference = `DEP-${Date.now()}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
    let gatewayOrder = null;


    const transaction = await Transaction.create({
      userId: req.user._id,
      type: "deposit",
      amount,
      method,
      status: "pending",
      reference,
      utr: utr || null, // ✅ NEW
      meta: { gatewayOrder }
    });

    ok(res, gatewayOrder ? "Payment order created" : "Manual deposit request created", {
      transaction,
      gatewayOrder,
      manualMode: !gatewayOrder
    }, 201);
  } catch (error) {
    next(error);
  }
};

export const verifyPayment = async (req, res, next) => {
  try {
    const { reference } = req.body;

    const transaction = await Transaction.findOne({ reference, userId: req.user._id });
    if (!transaction) return fail(res, 404, "Transaction not found");
    if (transaction.status === "success") return ok(res, "Payment already verified", { transaction });

    // ✅ Manual/UPI — stays pending, admin approves via Transactions panel
    ok(res, "Manual payment submitted. Awaiting admin approval.", { transaction });
  } catch (error) {
    next(error);
  }
};



export const getMyTransactions = async (req, res, next) => {
  try {
    const page = Math.max(Number(req.query.page) || 1, 1);
    const limit = Math.min(Math.max(Number(req.query.limit) || 10, 1), 50);
    const skip = (page - 1) * limit;
    const filter = { userId: req.user._id };

    if (req.query.status) filter.status = req.query.status;

    const [transactions, total] = await Promise.all([
      Transaction.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
      Transaction.countDocuments(filter)
    ]);

    ok(res, "Transactions fetched", {
      transactions,
      total,
      page,
      pages: Math.ceil(total / limit) || 1
    });
  } catch (error) {
    next(error);
  }
};
