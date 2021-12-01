import { Prisma } from ".prisma/client";
import ApiErrorException from "../Exceptions/ApiErrorException";
import meta from "../types/meta";
import Model from "./Model"

class VerifyRequest extends Model {
    public static async create(userId: string) {
        const prisma = VerifyRequest.getPrisma();
        const request = await prisma.verifyRequest.create({
            data: {
                userId
            }
        }).catch(err => {
            if (err instanceof Prisma.PrismaClientKnownRequestError) {
                let message: string = "";
                let data: meta = err.meta as meta
                switch (err.code) {
                    case "P2002":
                        message = `this user has verify request`
                        break;
                }
                throw new ApiErrorException(message, 403);
            }
        })
        return request;
    }
}

export default VerifyRequest;