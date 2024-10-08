import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import PrismaMeta from "../Types/Meta";

class PrismaException extends Error {
	private statusCode: number;
	private errorMessage: string;
	private prismaErrorType: string;
	private prismaMessage: string;
	private prismaErrorCode?: string | undefined;
	private prismaMetadata?: Record<string, unknown> | undefined;
	private prismaErrorEntity: string;
	constructor(
		prismaErrorEntity: string,
		prismaErrorType: string,
		prismaMessage: string,
		prismaErrorCode?: string,
		prismaMetadata?: Record<string, unknown>,
	) {
		super();
		this.statusCode = 500;
		this.prismaMessage = prismaMessage;
		this.prismaErrorType = prismaErrorType;
		this.prismaErrorEntity = prismaErrorEntity;
		this.prismaErrorCode =
			(prismaErrorCode && prismaErrorCode) || undefined;
		this.prismaMetadata = (prismaMetadata && prismaMetadata) || undefined;
		this.errorMessage = this.setErrorMessage();
	}
	public getStatusCode() {
		return this.statusCode;
	}
	public getErrorMessage() {
		return this.errorMessage;
	}
	private setErrorMessage() {
		let errorMessage: string = "";
		switch (this.prismaErrorType) {
			case "PrismaClientKnownRequestError":
				switch (this.prismaErrorCode) {
					case "P2002":
						this.statusCode = 409;
						if (Array.isArray(this.prismaMetadata?.target)) {
							errorMessage = `${this.prismaErrorEntity} with this ${this.prismaMetadata?.target[0]} exist`;
						}
						break;
					case "P2003":
						this.statusCode = 409;
						console.log(this);
						errorMessage = `Foreign key constraint failed`;
						break;
					case "P2025":
						this.statusCode = 404;
						errorMessage = `this ${this.prismaErrorEntity} does not exist`;
						break;
					default:
						errorMessage = "Something went wrong! try again later";
						console.log(`[ERROR]${this.prismaMessage}`);
						break;
				}
				break;
			case "PrismaClientValidationError":
			case "PrismaClientUnknownRequestError":
			case "PrismaClientRustPanicError":
			case "PrismaClientInitializationError":
				errorMessage = "Something went wrong! try again later";
				console.log(`[ERROR]${this.prismaMessage}`);
				break;
		}
		return errorMessage;
	}
	public static createException(err: Error, entityName: string) {
		let errCode: string | undefined = undefined;
		let errMeta: Record<string, unknown> | undefined = undefined;
		if (err instanceof PrismaClientKnownRequestError) {
			errCode = err.code;
			errMeta = err.meta as Record<string, unknown>;
		}
		return new PrismaException(
			entityName,
			err.constructor.name,
			err.message,
			errCode,
			errMeta,
		);
	}
}

export default PrismaException;
