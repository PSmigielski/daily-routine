import Model from "./Model";
import jwt from "jsonwebtoken";
import PrismaException from "../Exceptions/PrismaException";

class RefreshToken extends Model {
	private userId: string;
	constructor(userId: string) {
		super();
		this.userId = userId;
	}
	public async createToken() {
		const refreshToken = jwt.sign(
			{ id: this.userId },
			process.env.JWT_SECRET as string,
			{ expiresIn: 60 * 60 * 24 * 60 },
		);
		const token = await this.prisma.refreshToken
			.create({
				data: {
					token: refreshToken,
					userId: this.userId,
				},
			})
			.catch((err) => {
				throw PrismaException.createException(err, "RefreshToken");
			});
		return token;
	}
	public static async getTokens(userId: string) {
		const refTokens = await this.prisma.refreshToken
			.findMany({
				where: { userId },
				include: { user: { select: { login: true } } },
			})
			.catch((err) => {
				throw PrismaException.createException(err, "RefreshToken");
			});
		return refTokens;
	}
	public static async deleteToken(id: string) {
		const deletedToken = await this.prisma.refreshToken
			.delete({
				where: { id },
			})
			.catch((err) => {
				throw PrismaException.createException(err, "RefreshToken");
			});
		return deletedToken;
	}
}

export default RefreshToken;
