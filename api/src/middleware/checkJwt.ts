import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import ApiErrorException from "../Exceptions/ApiErrorException";

const checkJwt = (req: Request, res: Response, next: NextFunction) => {
    if (!req.cookies.BEARER) {
        throw new ApiErrorException("Token not found", 401);
    }
    const token = jwt.verify(req.cookies.BEARER, process.env.JWT_SECRET as string);
    req.user = token;
    next();
}

export default checkJwt;