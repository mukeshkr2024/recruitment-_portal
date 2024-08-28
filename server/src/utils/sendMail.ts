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

const createTransporter = (): Transporter => {
    return nodemailer.createTransport({
        service: 'Office365', // Office365 uses the service name 'Office365'
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS
        },
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT),
        secure: process.env.SMTP_SECURE === 'true', // Convert to boolean
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
        const response = await transporter.sendMail(mailOptions);

        console.log(response);

    } catch (error) {
        console.error("Error sending email:", error);
        throw new Error("Error sending email");
    }
};
