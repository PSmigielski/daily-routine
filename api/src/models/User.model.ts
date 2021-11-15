import { Prisma } from '@prisma/client'
import { randomBytes, scryptSync } from "crypto";
import ApiErrorException from "../Exceptions/ApiErrorException";
import meta from '../types/meta';
import Model from "./Model";

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
                password: `${salt}${scryptSync(this.plainPassword as string, salt, 64).toString("hex")}`
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
    public static async verify(id: string) {
        const prisma = User.getPrisma();

        const request = await prisma.verifyRequest.findUnique({
            where: {
                id
            }
        }).catch(err => {
            throw new ApiErrorException("request with this id does not exist", 404);
        })
        if (request) {
            const user = await prisma.user.findUnique({
                where: {
                    id: request?.userId
                }
            }).catch(err => {
                throw new ApiErrorException("user with this id does not exist", 404);
            })
            await prisma.user.update({
                where: {
                    id: user?.id
                },
                data: {
                    isVerified: true
                },
            }).catch(err => {
                throw new ApiErrorException("user with this id does not exist", 404);
            })
            await prisma.verifyRequest.delete({
                where: {
                    id: request?.id
                }
            }).catch(err => {
                throw new ApiErrorException("request with this id does not exist", 404);
            })
        } else {
            throw new ApiErrorException("request with this id does not exist", 404);
        }
    }
}

export default User;