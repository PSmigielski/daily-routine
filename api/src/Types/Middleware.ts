import { NextFunction, Request, Response } from "express";

export type Middleware = Array<
        ((
            req: Request,
            res: Response,
            next: NextFunction,
        ) => void)
            | ((
                  req: Request,
                  res: Response,
                  next: NextFunction,
              ) => Promise<void>)
            | ((
                  pathToSchema: string,
              ) => (req: Request, res: Response, next: NextFunction) => void)
            | ((
                  ids: Array<string> | string,
              ) => (req: Request, res: Response, next: NextFunction) => void)
    >;


