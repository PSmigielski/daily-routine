import { randomBytes, scryptSync } from "crypto";
import ApiErrorException from "../Exceptions/ApiErrorException";
import Model from "./Model";
import PrismaException from "../Exceptions/PrismaException";

class User extends Model {
	private login: string;
	private plainPassword: string;
	private email: string;
	private countryId: string;
	private timezoneId: string;
	constructor(
		email: string,
		login: string,
		plainPassword: string,
		countryId: string,
		timezoneId: string,
	) {
		super();
		this.email = email;
		this.login = login;
		this.plainPassword = plainPassword;
		this.countryId = countryId;
		this.timezoneId = timezoneId;
	}
	private static createPasswordHash(password: string) {
		const salt = randomBytes(32).toString("hex"); //2chars at one byte
		const hashedPassword = `${salt}:${scryptSync(
			password,
			salt,
			64,
		).toString("hex")}`;
		return hashedPassword;
	}
	public async createUser() {
		const user = await this.prisma.user
			.create({
				data: {
					email: this.email,
					login: this.login,
					password: User.createPasswordHash(this.plainPassword),
					countryId: this.countryId,
					timezoneId: this.timezoneId,
				},
			})
			.catch((err) => {
				throw PrismaException.createException(err, "User");
			});
		return user;
	}
	public static async verify(id: string) {
		const updatedUser = await this.prisma.user
			.update({
				where: { id },
				data: { isVerified: true },
			})
			.catch((err) => {
				throw PrismaException.createException(err, "User");
			});
	}
	public static async getUsersFromTimezones(hour: number) {
		const timezones = (await this.prisma.$queryRawUnsafe(
			`select id  from "Timezone" t group by t.id having (SELECT FLOOR(t2."gmtOffset")+${hour} FROM "Timezone" t2 where t.id = t2.id) = 0 or (SELECT FLOOR(t2."gmtOffset")+${hour} FROM "Timezone" t2 where t.id = t2.id) = 24`,
		)) as Array<{ id: string }>;
		const timezoneArr: Array<string> = [];
		timezones.forEach((el) => timezoneArr.push(Object.values(el)[0]));
		const users = await this.prisma.user
			.findMany({
				select: { id: true, email: true, timezone: true },
				where: { timezoneId: { in: timezoneArr } },
			})
			.catch((err) => {
				throw PrismaException.createException(err, "User");
			});
		return users;
	}
	public static async getUserById(userId: string) {
		if (userId) {
			const user = await this.prisma.user
				.findUnique({
					where: { id: userId },
				})
				.catch((err) => {
					throw PrismaException.createException(err, "User");
				});
			if (user) {
				return user;
			} else {
				throw new ApiErrorException(
					"User with this id does not exist!",
					404,
				);
			}
		} else {
			throw new ApiErrorException("undefined user id", 404);
		}
	}
	public static async getUserByEmail(email: string) {
		if (email == undefined) {
			throw new ApiErrorException("undefined email", 404);
		}
		const user = await this.prisma.user
			.findUnique({
				where: { email },
			})
			.catch((err) => {
				throw PrismaException.createException(err, "User");
			});
		return user;
	}
	public static async updateLocation(
		country: string,
		timezone: string,
		userId: string,
	) {
		const user = await this.prisma.user
			.update({
				where: { id: userId },
				data: { countryId: country, timezoneId: timezone },
			})
			.catch((err) => {
				throw PrismaException.createException(err, "User");
			});
		return user;
	}
	public static async getUserByLogin(login: string) {
		if (login == undefined) {
			throw new ApiErrorException("undefined login", 404);
		}
		const user = await this.prisma.user
			.findUnique({
				where: { login },
			})
			.catch((err) => {
				throw PrismaException.createException(err, "User");
			});
		return user;
	}
	public static async updatePassword(newPassword: string, id: string) {
		const updatedUser = await this.prisma.user
			.update({
				data: {
					password: User.createPasswordHash(newPassword),
				},
				where: { id },
			})
			.catch((err) => {
				throw PrismaException.createException(err, "User");
			});
		return updatedUser;
	}
	public static async updateLogin(login: string, id: string) {
		await this.prisma.user
			.update({
				data: { login },
				where: { id },
			})
			.catch((err) => {
				throw PrismaException.createException(err, "User");
			});
		return true;
	}
	public static async remove(id: string) {
		const removedUser = await this.prisma.user
			.delete({ where: { id } })
			.catch((err) => {
				throw PrismaException.createException(err, "User");
			});
		return removedUser;
	}
}

export default User;
