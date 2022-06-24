import { NextFunction, Request, Response } from "express";
import ApiErrorException from "../exceptions/ApiErrorException";
import checkJwt from "../middleware/checkJwt";
import checkUuid from "../middleware/checkUuid";
import schemaValidator from "../middleware/schemaValidator";
import User from "../models/User.model";
import AuthService from "../services/AuthService";
import { Methods } from "../types/Methods";
import Controller from "./Controller";
class AuthController extends Controller {
    constructor() {
        super();
    }
    public path = "/auth";
    public routes = [
        {
            path: "/login",
            method: Methods.POST,
            handler: this.login,
            localMiddleware: [
                schemaValidator("/../../schemas/login.schema.json"),
            ],
        },
        {
            path: "/register",
            method: Methods.POST,
            handler: this.register,
            localMiddleware: [
                schemaValidator("/../../schemas/register.schema.json"),
            ],
        },
        {
            path: "/logout",
            method: Methods.POST,
            handler: this.logout,
            localMiddleware: [checkJwt],
        },
        {
            path: "/verify/:requestId",
            method: Methods.GET,
            handler: this.verify,
            localMiddleware: [checkUuid("requestId")],
        },
        {
            path: "/refresh",
            method: Methods.POST,
            handler: this.refreshBearerToken,
            localMiddleware: [],
        },
        {
            path: "/forget",
            method: Methods.POST,
            handler: this.sendResetRequest,
            localMiddleware: [
                schemaValidator("/../../schemas/forget.schema.json"),
            ],
        },
        {
            path: "/reset/:requestId",
            method: Methods.PUT,
            handler: this.reset,
            localMiddleware: [
                checkUuid("requestId"),
                schemaValidator("/../../schemas/reset.schema.json"),
            ],
        },
        {
            path: "/edit/password",
            method: Methods.PUT,
            handler: this.editPassword,
            localMiddleware: [
                checkJwt,
                schemaValidator("/../../schemas/editPassword.schema.json"),
            ],
        },
        {
            path: "/edit/login",
            method: Methods.PUT,
            handler: this.editLogin,
            localMiddleware: [
                checkJwt,
                schemaValidator("/../../schemas/editLogin.schema.json"),
            ],
        },
        {
            path: "/account",
            method: Methods.DELETE,
            handler: this.removeAccount,
            localMiddleware: [
                checkJwt
            ],
        }
    ];

    public async register(req: Request, res: Response, next: NextFunction) {
        const { email, login, password } = req.body;
        const data = await new AuthService()
            .createAccount(email, login, password)
            .catch(next);
        if (data) {
            return res.status(201).json(data);
        }
    }
    public async login(req: Request, res: Response, next: NextFunction) {
        const { login, password } = req.body;
        const result = await new AuthService()
            .login({ login, password })
            .catch(next);
        if (result) {
            const tokenExp: Date = new Date();
            tokenExp.setTime((result.jwt.exp as number) * 1000);
            const refreshTokenExp = new Date();
            refreshTokenExp.setTime((result.refreshToken.exp as number) * 1000);
            return res
                .cookie("BEARER", result.jwt.token, {
                    httpOnly: true,
                    expires: tokenExp,
                })
                .cookie("REFRESH_TOKEN", result.refreshToken, {
                    httpOnly: true,
                    expires: refreshTokenExp,
                })
                .status(200)
                .json({ message: "user logged in" });
        }
    }
    public async verify(req: Request, res: Response, next: NextFunction) {
        const { requestId } = req.params;
        const result = await new AuthService().verify(requestId).catch(next);
        if (result) {
            return res
                .status(202)
                .json({ message: "Email has been verified successfully" });
        }
    }
    public async logout(req: Request, res: Response, next: NextFunction) {
        const result = await new AuthService()
            .logout(req.user?.refTokenId)
            .catch(next);
        if (result) {
            req.user = undefined;
            return res
                .clearCookie("BEARER")
                .clearCookie("REFRESH_TOKEN")
                .status(202)
                .json({ message: "user logged out successfully" });
        }
    }
    public async refreshBearerToken(
        req: Request,
        res: Response,
        next: NextFunction,
    ) {
        if (req.cookies.REFRESH_TOKEN != undefined) {
            const newToken = await new AuthService()
                .refreshBearerToken(req.cookies.REFRESH_TOKEN.token)
                .catch(next);
            if (newToken !== undefined) {
                const tokenExp: Date = new Date();
                tokenExp.setTime((newToken?.exp as number) * 1000);
                return res
                    .cookie("BEARER", newToken?.token, {
                        httpOnly: true,
                        expires: tokenExp,
                    })
                    .status(200)
                    .json({ message: "token has been refreshed" });
            }
        } else {
            next(new ApiErrorException("REFRESH_TOKEN cookie not found", 401));
        }
    }
    public async sendResetRequest(
        req: Request,
        res: Response,
        next: NextFunction,
    ) {
        const { email } = req.body;
        const result = await new AuthService()
            .sendResetRequest(email)
            .catch(next);
        if (result) {
            return res.json({ message: "reset request has been sent" });
        }
    }
    public async reset(req: Request, res: Response, next: NextFunction) {
        const { newPassword } = req.body;
        const { requestId } = req.params;
        const result = await new AuthService()
            .resetPassword(newPassword, requestId)
            .catch(next);
        if (result) {
            res.json({ message: "Password reset successfully" });
        }
    }
    public async editLogin(req: Request, res: Response, next: NextFunction) {
        const { login } = req.body;
        const result = await User.updateLogin(login, req.user?.id);
        if (result) {
            const result2 = await new AuthService()
                .logout(req.user?.refTokenId)
                .catch(next);
            if (result2) {
                return res
                    .clearCookie("BEARER")
                    .clearCookie("REFRESH_TOKEN")
                    .status(202)
                    .json({
                        message:
                            "You must sign in to complete the login change",
                    });
            }
        }
    }
    public async editPassword(req: Request, res: Response, next: NextFunction) {
        const { password, newPassword } = req.body;
        const result = await new AuthService()
            .editPassword(password, newPassword, req.user?.id)
            .catch(next);
        if (result) {
            return res
                .status(202)
                .json({ message: "password updated successfully" });
        }
    }
    public async removeAccount(
        req: Request,
        res: Response,
        next: NextFunction,
    ) {
        const removedUser = await User.remove(req.user?.id).catch(next);
        if (removedUser) {
            return res.status(202).json({ message: "User has been removed" });
        }
    }
}
export default AuthController;