import { NextFunction, Request, Response } from "express";
import ApiErrorException from "../Exceptions/ApiErrorException";
import User from "../models/User.model";
import MailerService from "../Services/MailerService";

class AuthController {
    public async register(req: Request, res: Response, next: NextFunction) {
        const { email, login, password } = req.body;
        const user = new User(email, login, password);
        const data = await user.createUser().catch(next);
        if (data) {
            MailerService.sendVerificationMail(data);
            return res.json(data);
        }
    }
    public async verify(req: Request, res: Response, next: NextFunction) {
        const { id } = req.params;
        const result = await User.verify(id).catch(next);
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
}
export default AuthController;