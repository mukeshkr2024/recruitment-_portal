import dotenv from "dotenv";
import nodemailer, { Transporter } from "nodemailer";
import ejs from "ejs";
import path from "path";

dotenv.config();

interface MailOptions {
    email: string;
    subject: string;
    template?: string;
    data?: Record<string, unknown>;
    text?: string;
    html?: string;
}

const createTransporter = (): Transporter => {
    return nodemailer.createTransport({
        service: 'Office365',
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS
        },
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT),
        secure: process.env.SMTP_SECURE === 'true',
    });
};


export const sendMail = async (options: MailOptions): Promise<void> => {
    const transporter = createTransporter();
    const { email, subject, template, data } = options;

    try {
        // Resolve the path to the email template file
        // @ts-ignore
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


    } catch (error) {
        console.error("Error sending email:", error);
        throw new Error("Error sending email");
    }
};


export const sendMailWithCustomBody = async (options: MailOptions): Promise<void> => {
    const transporter = createTransporter();
    const { email, subject, text, html } = options;

    if (!text && !html) {
        throw new Error("Either text or html body is required for this method");
    }

    try {
        const mailOptions = {
            from: process.env.SMTP_MAIL,
            to: email,
            subject,
            text,
            html,
        };

        const result = await transporter.sendMail(mailOptions);

        console.log(result);

    } catch (error) {
        console.error("Error sending email with custom body:", error);
        throw new Error("Error sending email with custom body");
    }
};