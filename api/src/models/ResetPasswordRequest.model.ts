import ApiErrorException from "../Exceptions/ApiErrorException";
import PrismaException from "../Exceptions/PrismaException";
import Model from "./Model";

class ResetPasswordRequest extends Model {
    public static async create(userId: string) {
        const prisma = ResetPasswordRequest.getPrisma();
        const request = prisma.resetPasswordRequest.create({ data: { userId } }).catch(err => { throw PrismaException.createException(err,"User") });
        return request
    }
    public static async getRequest(requestId: string) {
        const prisma = ResetPasswordRequest.getPrisma()
        const request = await prisma.resetPasswordRequest.findUnique({ 
            where: { id: requestId } 
        }).catch(err => { throw PrismaException.createException(err,"User") });
        if (request == undefined) {
            throw new ApiErrorException("Reset password request with this id does not exitst!", 404);
        } else {
            return request;
        }
    }
    public static async removeRequest(requestId: string) {
        const prisma = ResetPasswordRequest.getPrisma();
        const request = await prisma.resetPasswordRequest.delete({
            where: { id: requestId } 
        }).catch(err => { throw PrismaException.createException(err,"User") });
        return true;
    }
}

export default ResetPasswordRequest;