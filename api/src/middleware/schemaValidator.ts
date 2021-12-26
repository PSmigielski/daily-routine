import Ajv, { JSONSchemaType, ValidateFunction } from "ajv";
import { NextFunction, Request, Response } from "express";
import addFormats from "ajv-formats";
import fs from "fs";
import IUser from "../types/IUser";
import ApiErrorException from "../Exceptions/ApiErrorException";
import validation from "ajv/dist/vocabularies/validation";

const schemaValidator = (pathToSchema: string) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const ajv = new Ajv();
        addFormats(ajv);
        const schema: JSONSchemaType<IUser> = JSON.parse(fs.readFileSync(`${__dirname}${pathToSchema}`).toString());
        const validate: ValidateFunction = ajv.compile(schema)
        if (!validate(req.body)) {
            console.log(validate.errors);
            if (validate.errors !== undefined && validate.errors !== null) {
                switch(validate.errors[0].keyword){
                    case "pattern":
                        throw new ApiErrorException(`${validate.errors[0].instancePath.substring(1)} does not match pattern`, 400);
                    break;
                    case "type":
                        throw new ApiErrorException(`${validate.errors[0].instancePath.substring(1)} has invalid type`, 400);
                    break;
                    case "required":
                        throw new ApiErrorException(`${validate.errors[0].params.missingProperty} required`, 400);
                    break;
                    case "additionalProperties":
                        throw new ApiErrorException(`no additional properties allowed`, 400);
                    break;
                    case "maxLength":
                        throw new ApiErrorException(`${validate.errors[0].instancePath.substring(1)} is too long`, 400);
                    break;
                    case "minLength":
                        throw new ApiErrorException(`${validate.errors[0].instancePath.substring(1)} is too short`, 400);
                    break;
                    case "format":
                        throw new ApiErrorException(`must match ${validate.errors[0].params.format} format`, 400);
                    break;
                }
            }
        }
        next();
    }
}

export default schemaValidator;