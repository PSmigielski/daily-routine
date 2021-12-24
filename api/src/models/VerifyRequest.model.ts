import PrismaException from "../Exceptions/PrismaException";
import Model from "./Model"

class VerifyRequest extends Model {
    public static async create(userId: string) {
        const prisma = VerifyRequest.getPrisma();
        const request = await prisma.verifyRequest.create({ 
            data: { userId }
        }).catch(err => { throw PrismaException.createException(err,"VerifyRequest") });
        return request;
    }
}

export default VerifyRequest;