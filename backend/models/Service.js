import mongoose from "mongoose";

const serviceSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true
    },
    providerServiceId: {
      type: String,
      required: true,
      trim: true
    },
    providerName: {
      type: String,
      enum: ["Peakerr", "JAP", "WorldOfSMM", "Manual"],
      default: "Peakerr"
    },
    rate: {
      type: Number,
      required: true,
      min: 0
    },
    minOrder: {
      type: Number,
      required: true,
      min: 1
    },
    maxOrder: {
      type: Number,
      required: true,
      min: 1
    },
    description: {
      type: String,
      default: ""
    },
    isActive: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);

const Service = mongoose.model("Service", serviceSchema);
export default Service;
