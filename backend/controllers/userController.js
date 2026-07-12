import User from "../models/User.js";
import Order from "../models/Order.js";
import Transaction from "../models/Transaction.js";
import { ok, fail } from "../utils/apiResponse.js";
import { sendOTPMail } from "../Emailverify/sendOtp.js";
import { sendContactMail } from "../Emailverify/sendContactMail.js";




// get profile controller 
export const getProfile = async (req, res) => {
  ok(res, "Profile fetched", { user: req.user });
};

// update profile controller
export const updateProfile = async (req, res, next) => {
  try {
    const { name, password } = req.body;
    const user = await User.findById(req.user._id).select("+password");

    if (name) user.name = name;
    if (password) user.password = password;
    await user.save();

    ok(res, "Profile updated", {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        balance: user.balance,
        apiKey: user.apiKey,
        isActive: user.isActive
      }
    });
  } catch (error) {
    next(error);
  }
};

// get balance controller  
export const getBalance = async (req, res) => {
  ok(res, "Balance fetched", { balance: req.user.balance });
};

// user dashboard controller
export const getUserDashboard = async (req, res, next) => {
  try {
    const [orders, totalOrders, completedOrders, deposits] = await Promise.all([
      Order.find({ userId: req.user._id }).populate("serviceId", "name").sort({ createdAt: -1 }).limit(5),
      Order.countDocuments({ userId: req.user._id }),
      Order.countDocuments({ userId: req.user._id, status: "completed" }),
      Transaction.aggregate([
        { $match: { userId: req.user._id, type: "deposit", status: "success" } },
        { $group: { _id: null, total: { $sum: "$amount" } } }
      ])
    ]);

    ok(res, "Dashboard fetched", {
      balance: req.user.balance,
      recentOrders: orders,
      stats: {
        totalOrders,
        completedOrders,
        totalDeposits: deposits[0]?.total || 0
      }
    });
  } catch (error) {
    next(error);
  }
};

// api key controller 
export const regenerateApiKey = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    user.apiKey = undefined;
    await user.save();
    ok(res, "API key regenerated", { apiKey: user.apiKey });
  } catch (error) {
    next(error);
  }
};

// contactus controll
export const Contactus = async (req, res) => {
  const { name, email, subject, message } = req.body;

  try {
    await sendContactMail({ name, email, subject, message });
    res.status(200).json({ success: true, message: "Message sent successfully 🎉" });
  } catch (error) {
    console.error("Contact form send failed:", error.message);
    res.status(500).json({ success: false, message: "Error sending message." });
  }
};

// forgter password controller  
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    const user = await User.findOne({ email: email.toLowerCase() });



    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found !"
      })
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000)// 10 min expiry
    user.OTP = otp
    user.OTPExpire = otpExpiry

    await user.save()

    await sendOTPMail(otp, user.email);


    return res.status(200).json({
      success: true,
      message: "OTP send to Email Successfully !"
    })

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    })
  }
}

// verify otp controller function 
export const verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const normalizedEmail = email.toLowerCase();

    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        message: "Email and OTP are required!"
      });
    }

    const user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User Not Found !"
      })
    }

    if (!user.OTP || !user.OTPExpire) {
      return res.status(400).json({
        success: false,
        message: "OTP is not Generated or already verify !"
      })
    }

    if (user.OTPExpire < new Date()) {
      return res.status(400).json({
        success: false,
        message: "OTP Has Expired Please Request New One !"
      })
    }

    if (user.otpAttempts >= 5) {
      user.OTP = null; user.OTPExpire = null; user.otpAttempts = 0;
      await user.save();
      return res.status(400).json({ success: false, message: "Too many attempts. Request a new OTP." });
    }

    if (otp !== user.OTP) {
      user.otpAttempts += 1;
      await user.save();

      return res.status(400).json({
        success: false,
        message: "OTP is Invalid "
      })
    }


    user.OTP = null;
    user.OTPExpire = null;
    user.isOTPVerified = true;
    user.otpAttempts = 0
    await user.save();


    return res.status(200).json({
      success: true,
      message: "OTP verified Successfully !"
    })

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    })
  }
}

// change pass controller 
export const changePassword = async (req, res) => {
  try {
    const { email, newPassword, confirmPassword } = req.body;
    const normalizedEmail = email.toLowerCase();

    if (!email || !newPassword || !confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "All fields are required!"
      });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Passwords do not match!"
      });
    }

    const user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User Not Found !"
      })
    }


    if (!user.isOTPVerified) {
      return res.status(403).json({
        success: false,
        message: "Please verify OTP first!"
      });
    }


    user.password = newPassword;
    user.isOTPVerified = false;
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Password changed successfully 🎉"
    })

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    })
  }
}
