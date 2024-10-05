import express, {
  Express,
  NextFunction,
  Request,
  RequestHandler,
  Response,
} from "express";
import "reflect-metadata";
import Container from "typedi";
import dotenv from "dotenv";
import "../Controllers/AuthController";
import "../Controllers/SubtaskController";
import "../Controllers/TaskController";
import "../Controllers/CountryController";
import ResetUserTasks from "../Commands/ResetUserTasks";
import { router } from "../Decorators/Controller";

class Server {
  private app: Express;
  private globalMiddleware: Array<RequestHandler>;
  private errorHandlers: Array<
    (
      err: Error,
      req: Request,
      res: Response,
      next: NextFunction,
    ) => void | Response<any, Record<string, any>>
  >;
  private pathPrefix = "/v1/api";
  constructor(
    globalMiddleware: Array<RequestHandler>,
    errorHandlers: Array<
      (
        err: Error,
        req: Request,
        res: Response,
        next: NextFunction,
      ) => void | Response<any, Record<string, any>>
    >,
  ) {
    dotenv.config();
    this.app = express();
    this.globalMiddleware = globalMiddleware;
    this.errorHandlers = errorHandlers;
    this.setupMiddleware();
    this.setupRoutes();
    this.setupErrorHandling();
    this.setupCronTasks();
  }
  private setupRoutes() {
    this.app.use(this.pathPrefix, router);
  }
  private setupMiddleware() {
    this.globalMiddleware.forEach((middleware) => {
      this.app.use(middleware);
    });
  }
  private setupErrorHandling() {
    this.errorHandlers.forEach((errorHandler) => {
      this.app.use(errorHandler);
    });
  }
  public getApp() {
    return this.app;
  }
  public async setupCronTasks() {
    await new ResetUserTasks().setup();
  }
  public startServer() {
    this.app.listen(process.env.PORT, () =>
      console.log(
        `[LOG] api is running at ${process.env.HOSTNAME}:${process.env.PORT}`,
      ),
    );
  }
}

export default Server;
