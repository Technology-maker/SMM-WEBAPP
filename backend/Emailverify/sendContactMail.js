import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, MAIL_FROM } = process.env;

const transporter = nodemailer.createTransport({
    host: SMTP_HOST,                   // smtp-relay.brevo.com
    port: Number(SMTP_PORT || 587),    // 587
    secure: Number(SMTP_PORT) === 465, // false for 587 (STARTTLS)
    auth: {
        user: SMTP_USER, // Brevo SMTP login, e.g. a7292e001@smtp-brevo.com
        pass: SMTP_PASS, // Brevo SMTP key
    },
});

export const sendContactMail = async ({ name, email, subject, message }) => {
    const mailOptions = {
        from: `"${name}" <${MAIL_FROM}>`, // must be a verified sender in Brevo
        to: MAIL_FROM,                    // where you want to receive contact messages
        replyTo: email,                   // so replying goes to the actual user
        subject: subject,
        text: `📩 New message from = ${name} \n\n 👤User Email = (${email}) \n\n 💭Message =  ${message}`,
    };

    await transporter.sendMail(mailOptions);
};