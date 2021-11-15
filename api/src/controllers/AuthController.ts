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
}
export default AuthController;