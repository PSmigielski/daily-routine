import { PrismaClient } from ".prisma/client";
import nodemailer from "nodemailer";
import IMailContent from "../types/IMailContent";
class MailerService {
    public static async sendMail(mailContent: IMailContent) {
        const prisma: PrismaClient = new PrismaClient();
        let transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_LOGIN,
                pass: process.env.EMAIL_PASSWORD
            },
        });
        let info = await transporter.sendMail(mailContent);
    }
}

export default MailerService