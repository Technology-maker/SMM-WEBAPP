import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    serviceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Service",
      required: true
    },
    link: {
      type: String,
      required: true,
      trim: true
    },
    quantity: {
      type: Number,
      required: true,
      min: 1
    },
    charge: {
      type: Number,
      required: true,
      min: 0
    },
    status: {
      type: String,
      enum: ["pending", "processing", "completed", "cancelled", "partial"],
      default: "pending"
    },
    startCount: {
      type: Number,
      default: 0
    },
    remains: {
      type: Number,
      default: 0
    },
    refunded: {
      type: Boolean,
      default: false
    },
    providerOrderId: {
      type: String,
      default: ""
    },
    lastSyncedAt: {          // ← ADD THIS
      type: Date,
      default: null
    },
    providerError: {
      type: String,
      default: ""
    }
  },
  { timestamps: true }
);

const Order = mongoose.model("Order", orderSchema);
export default Order;
