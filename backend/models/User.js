import crypto from "crypto";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 80
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
      select: false
    },
    OTP: {
      type: String,
      default: null
    },
    OTPExpire: {
      type: Date,
      default: null
    },
    isOTPVerified: {
      type: Boolean,
      default: false
    },
    otpAttempts: {
      type: Number,
      default: 0
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user"
    },
    balance: {
      type: Number,
      default: 0,
      min: 0
    },
    apiKey: {
      type: String,
      unique: true,
      sparse: true
    },
    isActive: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);

userSchema.pre("save", async function hashPassword(next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.pre("save", function ensureApiKey(next) {
  if (!this.apiKey) {
    this.apiKey = `smm_${crypto.randomBytes(24).toString("hex")}`;
  }
  next();
});

userSchema.methods.matchPassword = function matchPassword(password) {
  return bcrypt.compare(password, this.password);
};

const User = mongoose.model("User", userSchema);
export default User;
