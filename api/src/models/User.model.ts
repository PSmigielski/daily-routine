import { Prisma } from '@prisma/client'
import jwt from "jsonwebtoken";
import { randomBytes, scryptSync, timingSafeEqual } from "crypto";
import ApiErrorException from "../Exceptions/ApiErrorException";
import meta from '../types/meta';
import Model from "./Model";
import RefreshToken from './RefreshToken.model';
import ResetPasswordRequest from './ResetPasswordRequest.model';

class User extends Model {
    private login: string | undefined;
    private plainPassword: string | undefined;
    private email: string | undefined;
    constructor(email?: string, login?: string, plainPassword?: string) {
        super();
        this.email = email;
        this.login = login;
        this.plainPassword = plainPassword;
    }
    public async createUser() {
        const prisma = User.getPrisma();
        const salt = randomBytes(32).toString("hex"); //2chars at one byte
        const user = await prisma.user.create({
            data: {
                email: this.email as string,
                login: this.login as string,
                password: `${salt}:${scryptSync(this.plainPassword as string, salt, 64).toString("hex")}`
            }
        }).catch(err => {
            if (err instanceof Prisma.PrismaClientKnownRequestError) {
                let message: string = "";
                let data: meta = err.meta as meta
                switch (err.code) {
                    case "P2002":
                        message = `User with this ${data.target[0]} exist`
                        break;
                }
                throw new ApiErrorException(message, 400);
            }
        })
        return user;
    }
    public static async login({ login, password }: { login: string, password: string }) {
        const prisma = User.getPrisma();
        const user = await prisma.user.findUnique({
            where: { login }
        })
        if (!user) {
            throw new ApiErrorException("Wrong credentials", 400);
        }
        if (!user.isVerified) {
            throw new ApiErrorException("user is not verified", 401);
        }
        const [salt, key] = user.password.split(":");
        const hashedBuffer = scryptSync(password, salt, 64);
        const keyBuffer = Buffer.from(key, 'hex');
        const match = timingSafeEqual(hashedBuffer, keyBuffer);
        if (!match) {
            throw new ApiErrorException("Wrong credentials", 400);
        }
        const refreshToken = await new RefreshToken(user.id).createToken();
        const token = jwt.sign({ id: user.id, login, refTokenId: refreshToken.id }, process.env.JWT_SECRET as string, { expiresIn: 60 * 15 })
        const tokenData = jwt.decode(token);
        const refreshTokenData = jwt.decode(refreshToken.token);
        if (typeof tokenData != "string" && typeof refreshTokenData != "string") {
            return {
                jwt: { token, exp: tokenData?.exp },
                refreshToken: { token: refreshToken.token, exp: refreshTokenData?.exp }
            }
        }
    }
    public static async logout(token: string) {
        const prisma = User.getPrisma();
        const decoded = jwt.decode(token);
        if (typeof decoded != "string") {
            const refToken = await prisma.refreshToken.delete({
                where: {
                    id: decoded?.refTokenId
                }
            }).catch(err => {
                if (err instanceof Prisma.PrismaClientKnownRequestError) {
                    let message: string = "";
                    let code: number = 500;
                    switch (err.code) {
                        case "P2025":
                            message = `this refresh token does not exist`;
                            code = 401;
                            break;
                        default:
                            message = "can't logout for some reason"
                    }
                    throw new ApiErrorException(message, code);
                }
            })
            return true;
        }
        return false;
    }
    public static async verify(id: string) {
        const prisma = User.getPrisma();
        const request = await prisma.verifyRequest.findUnique({
            where: { id },
            include: {
                user:{
                    select: {
                        id:true
                    }
                }
            }
        })
        //    throw new ApiErrorException("request with this id does not exist", 404);
        if (request) {
            await prisma.user.update({
                where: { id: request.user?.id },
                data: { isVerified: true },
            }).catch(err => {
                throw new ApiErrorException("user with this id does not exist", 404);
            })
            await prisma.verifyRequest.delete({
                where: { id: request?.id }
            })
            return true;
        } else {
            throw new ApiErrorException("request with this id does not exist", 404);
        }
    }
    public static async refreshToken(token: string) {
        const prisma = User.getPrisma();
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
        if (typeof decoded != "string") {
            const refTokens = await prisma.refreshToken.findMany({
                where: { userId: decoded.id },
                include:{ 
                    user:{
                        select:{
                            login: true
                        }
                    } 
                }
            })
            const refToken = refTokens.find(el => el.token == token)
            console.log(refToken);
            if (refTokens.length === 0 || typeof refToken == "undefined") {
                throw new ApiErrorException("no refresh token found", 403);
            } else {
                const newToken: string = jwt.sign({ id: decoded.id, login: refToken.user?.login, refTokenId: refToken?.id }, process.env.JWT_SECRET as string, { expiresIn: 60 * 15 })
                const tokenData = jwt.decode(newToken);
                if (typeof tokenData != "string") {
                    return {
                        token: newToken,
                        exp: tokenData?.exp
                    }
                }
            }
        }
    }
    public static async getUserById(userId: string) {
        const prisma = User.getPrisma();
        const user = await prisma.user.findUnique({
            where: { id: userId }
        });
        if (user == undefined) {
            throw new ApiErrorException("User with this id does not exist!", 404);
        } else {
            return user;
        }
    }
    public static async getUserByEmail(email: string) {
        const prisma = User.getPrisma();
        const user = await prisma.user.findUnique({
            where: { email }
        });
        if (user == undefined) {
            throw new ApiErrorException("User with this email does not exist!", 404);
        } else {
            return user;
        }
    }
    public static async resetPassword(newPassword: string, requestId: string) {
        const prisma = User.getPrisma();
        const request = await ResetPasswordRequest.getRequest(requestId);
        if(request){
            const salt = randomBytes(32).toString("hex");
            const hashedPassword = `${salt}:${scryptSync(newPassword, salt, 64).toString("hex")}`;
            const result = await ResetPasswordRequest.removeRequest(requestId);
            const user = await prisma.user.update({
                data: { password: hashedPassword },
                where: { id:request?.userId }
            })
            return true;
        } else{
            return false;
        }
    }
}

export default User;