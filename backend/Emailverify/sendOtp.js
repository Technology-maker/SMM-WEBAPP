import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

const BREVO_API_URL = "https://api.brevo.com/v3/smtp/email";

export const sendOTPMail = async (otp, email) => {
    const payload = {
        sender: {
            name: "SMM Support",
            email: process.env.MAIL_FROM, // must be a verified sender in Brevo
        },
        to: [{ email }],
        subject: "Password Reset OTP",
        htmlContent: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto;">
        <h2>Password Reset Request</h2>

        <p>Hello,</p>

        <p>We received a request to reset your password.</p>

        <div style="text-align:center; margin:30px 0;">
          <span style="
            font-size:32px;
            font-weight:bold;
            letter-spacing:8px;
            color:#2563eb;
          ">
            ${otp}
          </span>
        </div>

        <p>This OTP is valid for <strong>10 minutes</strong>.</p>

        <p>If you did not request this password reset, please ignore this email.</p>

        <br>

        <p>Regards,<br>SMM Support Team</p>
      </div>
    `,
    };

    await axios.post(BREVO_API_URL, payload, {
        headers: {
            "api-key": process.env.BREVO_API_URL,
            "Content-Type": "application/json",
            "Accept": "application/json",
        },
        timeout: 10000, // fail fast instead of hanging
    });
};
