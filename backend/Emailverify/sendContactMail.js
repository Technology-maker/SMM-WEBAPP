import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const transporter = nodemailer.createTransport({
    host: process.env.BREVO_SMTP_HOST || "smtp-relay.brevo.com",
    port: Number(process.env.BREVO_SMTP_PORT || 587),
    secure: false, // Brevo uses STARTTLS on port 587, not SSL
    auth: {
        user: process.env.BREVO_SMTP_USER, // your Brevo SMTP login (looks like xxxxx@smtp-brevo.com)
        pass: process.env.BREVO_SMTP_PASS, // your Brevo SMTP key (not your account password)
    },
});

export const sendContactMail = async ({ name, email, subject, message }) => {
    const mailOptions = {
        from: `"${name}" <${process.env.MAIL_FROM || process.env.BREVO_SENDER_EMAIL}>`, // must be a verified sender in Brevo
        to: process.env.CONTACT_RECEIVER_EMAIL || process.env.MAIL_FROM,
        replyTo: email,
        subject: subject,
        text: `📩 New message from = ${name} \n\n 👤User Email = (${email}) \n\n 💭Message =  ${message}`,
    };

    await transporter.sendMail(mailOptions);
};