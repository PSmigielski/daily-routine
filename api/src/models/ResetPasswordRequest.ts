import { Prisma } from ".prisma/client";
import ApiErrorException from "../Exceptions/ApiErrorException";
import meta from "../types/meta";
import Model from "./Model";

class ResetPasswordRequest extends Model {
    public static async create(userId: string) {
        const prisma = ResetPasswordRequest.getPrisma();
        const request = prisma.resetPasswordRequest.create({ data: { userId } }).catch(err => {
            if (err instanceof Prisma.PrismaClientKnownRequestError) {
                let message: string = "";
                let data: meta = err.meta as meta
                switch (err.code) {
                    case "P2002":
                        message = `Request for this user exist!`
                        break;
                }
                throw new ApiErrorException(message, 400);
            }
        });
        return request
    }
}

export default ResetPasswordRequest;