import Model from "./Model";
import jwt from "jsonwebtoken";
import ApiErrorException from "../Exceptions/ApiErrorException";

class RefreshToken extends Model {
    private userId: string | undefined;
    constructor(userId?: string) {
        super();
        this.userId = userId;
    }
    public createToken() {
        const prisma = RefreshToken.getPrisma();
        const refreshToken = jwt.sign({ id: this.userId }, process.env.JWT_SECRET as string, { expiresIn: 60 * 60 * 24 * 60 });
        const token = prisma.refreshToken.create({
            data: {
                token: refreshToken,
                userId: this.userId as string
            }
        }).catch(err => {
            throw new ApiErrorException("Refresh token can't be created for some reason", 500);
        })
        return token;
    }
}

export default RefreshToken