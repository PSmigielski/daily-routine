import { NextFunction, Request, Response } from "express";
import ApiErrorException from "../Exceptions/ApiErrorException";
import ResetPasswordRequest from "../models/ResetPasswordRequest.model";
import User from "../models/User.model";
import VerifyRequest from "../models/VerifyRequest.model";
import MailerService from "../Services/MailerService";

class AuthController {
    public async register(req: Request, res: Response, next: NextFunction) {
        const { email, login, password } = req.body;
        const user = new User(email, login, password);
        const data = await user.createUser().catch(next);
        if (data) {
            const request = await VerifyRequest.create(data.id).catch(next)
            if (request) {
                MailerService.sendMail({
                    from: "Daily Routine",
                    to: email,
                    subject: "Verify your account",
                    html: `<h1>Hi!</h1>
                    <p> To verify your email, please visit the following <a href="http://localhost:4000/v1/api/auth/verify/${request.id}" >link</a></p>
                    <br><p> Cheers! </p>`,
                });
                return res.json(data);
            }
        }
    }
    public async verify(req: Request, res: Response, next: NextFunction) {
        const { requestId } = req.params;
        const result = await User.verify(requestId).catch(next);
        if (result) {
            return res.status(202).json({ message: "User has been verified successfully" })
        }
    }
    public async login(req: Request, res: Response, next: NextFunction) {
        const { login, password } = req.body;
        const result = await User.login({ login, password }).catch(next);
        if (result) {
            const tokenExp: Date = new Date();
            tokenExp.setTime(result.jwt.exp as number * 1000);
            const refreshTokenExp = new Date()
            refreshTokenExp.setTime(result.refreshToken.exp as number * 1000);
            return res
                .cookie("BEARER", result.jwt.token, { httpOnly: true, expires: tokenExp })
                .cookie("REFRESH_TOKEN", result.refreshToken, { httpOnly: true, expires: refreshTokenExp })
                .status(200).json({ message: "user logged in" });
        }
    }
    public async logout(req: Request, res: Response, next: NextFunction) {
        const result = await User.logout(req.user as { id: string, login: string, iat: number, exp: number }, req.cookies.BEARER).catch(next);
        if (result) {
            req.user = undefined;
            return res.clearCookie("BEARER").clearCookie("REFRESH_TOKEN").status(202).json({ message: "user logged out successfully" });
        }
    }
    public async refreshToken(req: Request, res: Response, next: NextFunction) {
        if (req.cookies.REFRESH_TOKEN != undefined) {
            //debug tjos shit
            const newToken = await User.refreshToken(req.cookies.REFRESH_TOKEN.token).catch(next)
            if (newToken !== undefined) {
                const tokenExp: Date = new Date();
                tokenExp.setTime(newToken?.exp as number * 1000);
                return res
                    .cookie("BEARER", newToken?.token, { httpOnly: true, expires: tokenExp })
                    .status(200).json({ message: "token has been refreshed" });
            }
        } else {
            next(new ApiErrorException("REFRESH_TOKEN cookie not found", 401))
        }
    }
    //add schemas to this 2 functions`
    public async sendResetRequest(req: Request, res: Response, next: NextFunction) {
        const { email } = req.body;
        const user = await User.getUserByEmail(email).catch(next);
        if (user) {
            const request = await ResetPasswordRequest.create(user.id).catch(next)
            if (request) {
                MailerService.sendMail({
                    from: "Daily Routine",
                    to: email,
                    subject: "Reset your password",
                    html: `<h1>Hi!</h1>
                    <p> To reset your password, please visit the following <a href="http://localhost:4000/v1/api/auth/reset/${request.id}" >link</a></p>
                    <br><p> Cheers! </p>`,
                });
                return res.json({ message: "reset request has been sent" });
            }
        }
    }
    public async reset(req: Request, res: Response, next: NextFunction) {
        const { newPassword } = req.body;
        const { requestId } = req.params

    }
}
export default AuthController;