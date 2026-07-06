import mongoose from "mongoose";

const settingsSchema = new mongoose.Schema(
  {
    siteName: {
      type: String,
      default: "BOOST GURU SMM"
    },
    currency: {
      type: String,
      default: "INR"
    },
    minDeposit: {
      type: Number,
      default: 100
    },
    maintenanceMode: {
      type: Boolean,
      default: false
    },
    supportEmail: {
      type: String,
      default: "support@smmpanel.local"
    },
    providerMarkupPercent: {
      type: Number,
      default: 25
    }
  },
  { timestamps: true }
);

const Settings = mongoose.model("Settings", settingsSchema);
export default Settings;
