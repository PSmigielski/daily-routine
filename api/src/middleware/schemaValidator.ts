import Ajv, { JSONSchemaType, ValidateFunction } from "ajv";
import { NextFunction, Request, Response } from "express";
import addFormats from "ajv-formats";
import fs from "fs";
import IUser from "../types/IUser";
import ApiErrorException from "../Exceptions/ApiErrorException";

const schemaValidator = (pathToSchema: string) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const ajv = new Ajv();
        addFormats(ajv);
        const schema: JSONSchemaType<IUser> = JSON.parse(fs.readFileSync(`${__dirname}${pathToSchema}`).toString());
        const validate: ValidateFunction = ajv.compile(schema)
        if (!validate(req.body)) {
            if (validate.errors !== undefined && validate.errors !== null) {
                throw new ApiErrorException(`${validate.errors[0].instancePath.substring(1)} ${validate.errors[0].message}`, 400);
            }
        }
        next();
    }
}

export default schemaValidator;