import Ajv, { JSONSchemaType, ValidateFunction } from "ajv";
import { NextFunction, Request, Response } from "express";
import addFormats from "ajv-formats";
import fs from "fs";
import IUser from "../Types/IUser";
import ApiErrorException from "../Exceptions/ApiErrorException";

const schemaValidator = (pathToSchema: string) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const ajv = new Ajv();
        addFormats(ajv);
        const schema: JSONSchemaType<IUser> = JSON.parse(fs.readFileSync(`${__dirname}${pathToSchema}`).toString());
        const validate: ValidateFunction = ajv.compile(schema)
        if (!validate(req.body)) {
            if (validate.errors !== undefined && validate.errors !== null) {
                console.log(validate.errors);
                switch(validate.errors[0].keyword){
                    case "minimum":
                        throw new ApiErrorException(`${validate.errors[0].instancePath.substring(1)} must be minimum ${validate.errors[0].params.limit}`, 400);
                    case "maximum":
                        throw new ApiErrorException(`${validate.errors[0].instancePath.substring(1)} can be up to ${validate.errors[0].params.limit}`, 400);
                    case "minProperties":
                        throw new ApiErrorException(`${validate.errors[0].params.limit} param/s required`, 400);
                    case "pattern":
                        throw new ApiErrorException(`${validate.errors[0].instancePath.substring(1)} does not match pattern`, 400);
                    case "type":
                        throw new ApiErrorException(`${validate.errors[0].instancePath.substring(1)} has invalid type`, 400);
                    case "required":
                        throw new ApiErrorException(`${validate.errors[0].params.missingProperty} required`, 400);
                    case "additionalProperties":
                        throw new ApiErrorException(`no additional properties allowed`, 400);
                    case "maxLength":
                        throw new ApiErrorException(`${validate.errors[0].instancePath.substring(1)} is too long`, 400);
                    case "minLength":
                        throw new ApiErrorException(`${validate.errors[0].instancePath.substring(1)} is too short`, 400);
                    case "format":
                        throw new ApiErrorException(`must match ${validate.errors[0].params.format} format`, 400);
                    default:
                        throw new ApiErrorException(`Something is wrong with your request`, 500);
                }
            }
        }
        next();
    }
}

export default schemaValidator;
