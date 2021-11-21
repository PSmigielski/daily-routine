import { NextFunction, Request, Response } from "express";
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
            res.status(202).json({ message: "User has been verified successfully" })
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
            res
                .cookie("BEARER", result.jwt.token, { httpOnly: true, expires: tokenExp })
                .cookie("REFRESH_TOKEN", result.refreshToken, { httpOnly: true, expires: refreshTokenExp })
                .status(200).json({ message: "user logged in" });
        }
    }
}
export default AuthController;