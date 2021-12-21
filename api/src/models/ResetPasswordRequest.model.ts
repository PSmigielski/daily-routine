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
    public static async getRequest(requestId: string) {
        const prisma = ResetPasswordRequest.getPrisma()
        const request = prisma.resetPasswordRequest.findUnique({
            where: { id: requestId }
        })
        if (request == undefined) {
            throw new ApiErrorException("Reset password request with this id does not exitst!", 404);
        } else {
            return request;
        }
    }
    public static async removeRequest(requestId: string) {
        const prisma = ResetPasswordRequest.getPrisma();
        const request = prisma.resetPasswordRequest.delete({
            where: { id: requestId }
        });
    }
}

export default ResetPasswordRequest;