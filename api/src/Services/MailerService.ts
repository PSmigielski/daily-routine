import { PrismaClient } from ".prisma/client";
import nodemailer from "nodemailer";
class MailerService {
    public static async sendVerificationMail({ email, id }: { email: string, id: string }) {
        const prisma: PrismaClient = new PrismaClient();
        let transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_LOGIN,
                pass: process.env.EMAIL_PASSWORD
            },
        });
        const request = await prisma.verifyRequest.create({
            data: {
                userId: id
            }
        })
        let info = await transporter.sendMail({
            from: "Daily Routine",
            to: email,
            subject: "Verify your account",
            html: `<h1>Hi!</h1>
            <p> To verify your email, please visit the following <a href="http://localhost:4000/v1/auth/verify/${request.id}" >link</a></p>
            <br><p> Cheers! </p>`,
        });
    }
}

export default MailerService