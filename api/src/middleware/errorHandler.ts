import { NextFunction, Request, Response } from "express";
import ApiErrorException from "../Exceptions/ApiErrorException";

const errorHandler = (err: ApiErrorException | Error, req: Request, res: Response, next: NextFunction) => {
    if (res.headersSent) {
        return next(err);
    }
    res.status(err instanceof ApiErrorException ? err.getCode() : 500).json({ error: err.message });
}

export default errorHandler;