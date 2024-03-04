import { NextFunction, Request, Response } from "express";
import { Controller } from "../Decorators/Controller";
import { Methods } from "../Decorators/Methods";
import { Methods as MethodsEnum } from "../Types/Methods";
import ApiErrorException from "../Exceptions/ApiErrorException";
import User from "../Models/User.model";
import AuthService from "../Services/AuthService";
import IIpData from "../Types/IIpData";
import schemaValidator from "../Middleware/schemaValidator";
import ipInfo from "../Middleware/ipinfoMiddleware";
import checkJwt from "../Middleware/checkJwt";
import checkUuid from "../Middleware/checkUuid";


@Controller("/auth")
class AuthController {

	@Methods("/register", MethodsEnum.POST, [schemaValidator("/../../schemas/register.schema.json"), ipInfo])
    public async register(req: Request, res: Response, next: NextFunction) {
        const { email, login, password } = req.body;
        const ipData = req.ipData;
        const data = await new AuthService()
            .createAccount(
                email,
                login,
                password,
                ipData?.country as string,
                ipData?.timezone as string,
            )
            .catch(next);
        if (data) {
            return res.status(201).json(data);
        }
    }
    @Methods("/login", MethodsEnum.POST, [schemaValidator("/../../schemas/login.schema.json"), ipInfo])
    
    public async login(req: Request, res: Response, next: NextFunction) {
        const { login, password } = req.body;
        const result = await new AuthService()
            .login({ login, password }, req.ipData as IIpData)
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

    @Methods("/verify/:requestId", MethodsEnum.GET, [checkUuid("requestId")])
    public async verify(req: Request, res: Response, next: NextFunction) {
        const { requestId } = req.params;
        const result = await new AuthService().verify(requestId).catch(next);
        if (result) {
            return res
                .status(202)
                .json({ message: "Email has been verified successfully" });
        }
    }

    @Methods("/logout", MethodsEnum.POST, [checkJwt, ipInfo])
    public async logout(req: Request, res: Response, next: NextFunction) {
        const result = await new AuthService()
            .logout(req.user?.refTokenId, req.ipData as IIpData)
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

    @Methods("/refresh", MethodsEnum.POST, [ipInfo])
    public async refreshBearerToken(
        req: Request,
        res: Response,
        next: NextFunction,
    ) {
        if (req.cookies.REFRESH_TOKEN != undefined) {
            const newToken = await new AuthService()
                .refreshBearerToken(req.cookies.REFRESH_TOKEN.token, req.ipData as IIpData)
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

    @Methods("/reset/:requestId", MethodsEnum.PUT, [checkUuid("requestId"), schemaValidator("/../../schemas/reset.schema.json")])

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
    @Methods("/forget", MethodsEnum.POST, [schemaValidator("/../../schemas/forget.schema.json")])
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
    @Methods("/edit/login", MethodsEnum.PUT, [checkJwt, schemaValidator("/../../schemas/editLogin.schema.json")])
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

    @Methods("/edit/password", MethodsEnum.PUT, [checkJwt, schemaValidator("/../../schemas/editPassword.schema.json")])
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

    @Methods("/account", MethodsEnum.DELETE, [checkJwt])
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
