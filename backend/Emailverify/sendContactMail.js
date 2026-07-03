import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

export const sendContactMail = async ({ name, email, subject, message }) => {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: process.env.EMAIL_USER,
        replyTo: email,
        subject: subject,
        text: `📩 New message from = ${name} \n\n 👤User Email = (${email}) \n\n 💭Message =  ${message}`,
    };

    await transporter.sendMail(mailOptions);
};