import meta from "../types/meta";

class PrismaException extends Error{
    private statusCode: number;
    private prismaErrorType: string;
    private prismaErrorCode: string;
    private prismaMessage: string | undefined;
    private prismaMetadata?: meta | undefined;
    private prismaErrorEntity: string;
    constructor(prismaErrorCode: string, statusCode: number = 500,prismaErrorEntity:string ,prismaErrorType:string ,prismaMetadata?: meta, prismaMessage?: string){
        super();
        this.statusCode = statusCode;
        this.prismaErrorCode = prismaErrorCode;
        this.prismaErrorType = prismaErrorType;
        this.prismaMetadata = prismaMetadata && prismaMetadata || undefined; 
        this.prismaMessage = prismaMessage && prismaMessage || undefined;
        this.prismaErrorEntity = prismaErrorEntity
    }
    public getStatusCode(){
        return this.statusCode;
    }
    public getErrorMessage(){
        let errorMessage:string = "";
        switch(this.prismaErrorType){
            case "PrismaClientKnownRequestError":
                switch(this.prismaErrorCode){
                    case "P2002":
                        errorMessage = `${this.prismaErrorEntity} with this ${this.prismaMetadata?.target[0]} exist`
                        break;
                    case "P2025":
                        errorMessage = `this ${this.prismaErrorEntity} does not exist`;
                        break;
                    default:
                        errorMessage = "Something went wrong! try again later";
                        console.log(`[ERROR]${this.prismaMessage}`);        
                        break;
                }
                break;
            case "PrismaClientValidationError":
                break;
            case "PrismaClientUnknownRequestError":
            case "PrismaClientRustPanicError":
            case "PrismaClientInitializationError":
                errorMessage = "Something went wrong! try again later";
                console.log(`[ERROR]${this.prismaMessage}`);
            break;

        }
        return errorMessage
    }
}

export default PrismaException;