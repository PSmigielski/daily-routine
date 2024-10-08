import "reflect-metadata";
import { PrismaClient } from ".prisma/client";
import nodemailer, { TransportOptions } from "nodemailer";
import IMailContent from "../Types/IMailContent";
import { Service as ServiceDecorator } from "typedi";

@ServiceDecorator()
class MailerService {
  public async sendMail(mailContent: IMailContent) {
    const prisma: PrismaClient = new PrismaClient();
    let transporter =
      process.env.ENV == "dev"
        ? nodemailer.createTransport({ host: "mailhog", port: 1025 })
        : nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 465,
            secure: true,
            auth: {
              type: "OAuth2",
              user: process.env.APP_EMAIL,
              clientId: process.env.CLIENT_ID,
              clientSecret: process.env.CLIENT_SECRET,
              refreshToken: process.env.REFRESH_TOKEN,
              accessToken: process.env.ACCESS_TOKEN,
            },
          } as TransportOptions);
    let info = await transporter.sendMail(mailContent);
  }
  public async sendVerificationMail(email: string, id: string) {
    await this.sendMail({
      from: "Daily Routine",
      to: email,
      subject: "Verify your account",
      html: `<h1>Hi!</h1>
            <p> To verify your email, please visit the following <a href="http://localhost:4000/v1/api/auth/verify/${id}" >link</a></p>
            <br><p> Cheers! </p>`,
    });
  }
  public async sendResetRequest(email: string, id: string) {
    await this.sendMail({
      from: "Daily Routine",
      to: email,
      subject: "Reset your password",
      html: `<h1>Hi!</h1>
            <p> To reset your password, please visit the following <a href="http://localhost:4000/v1/api/auth/reset/${id}" >link</a></p>
            <br><p> Cheers! </p>`,
    });
  }
}

export default MailerService;
