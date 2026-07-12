import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

const BREVO_API_URL = "https://api.brevo.com/v3/smtp/email";

export const sendContactMail = async ({ name, email, subject, message }) => {
    const payload = {
        sender: {
            name: "SMM Panel Contact Form",
            email: process.env.MAIL_FROM, // must be a verified sender in Brevo
        },
        to: [
            {
                email: process.env.EMAIL_USER, // where you want to receive contact messages
            },
        ],
        replyTo: {
            email: email, // so replying goes to the actual visitor
            name: name,
        },
        subject: subject,
        textContent: `📩 New message from = ${name} \n\n 👤User Email = (${email}) \n\n 💭Message =  ${message}`,
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
