import dotenv from "dotenv";
import nodemailer, { Transporter } from "nodemailer";
import ejs from "ejs";
import path from "path";

// Load environment variables
dotenv.config();

interface MailOptions {
    email: string;
    subject: string;
    template: string;
    data: Record<string, unknown>;
}

// Create a nodemailer transporter
const createTransporter = (): Transporter => {
    return nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: parseInt(process.env.SMTP_PORT || "587", 10),
        service: process.env.SMTP_SERVICE,
        auth: {
            user: process.env.SMTP_MAIL,
            pass: process.env.SMTP_PASSWORD,
        },
    });
};

// Send an email using the specified template and data
export const sendMail = async (options: MailOptions): Promise<void> => {
    const transporter = createTransporter();
    const { email, subject, template, data } = options;

    try {
        // Resolve the path to the email template file
        const templatePath = path.resolve(__dirname, "../mails", template);

        // Render the email template with EJS
        const html = await ejs.renderFile(templatePath, data);

        // Create the mail options
        const mailOptions = {
            from: process.env.SMTP_MAIL,
            to: email,
            subject,
            html,
        };

        // Send the email
        await transporter.sendMail(mailOptions);
    } catch (error) {
        console.error("Error sending email:", error);
        throw new Error("Error sending email");
    }
};
