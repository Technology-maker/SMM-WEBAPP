import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();


const transporter = nodemailer.createTransport({
    host: "smtp-relay.brevo.com",
    port: 587,
    secure: false,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});

export const sendOTPMail = async (otp, email) => {
    await transporter.sendMail({
        from: `"SMM Support" <noreply@shreevinayak.shop>`,
        to: email,
        subject: "Password Reset OTP",
        html: `
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
    });
};