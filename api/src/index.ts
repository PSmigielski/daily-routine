import { json } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import Server from "./config/Server";
import AuthController from "./controllers/AuthController";
import prismaErrorHandler from "./middleware/prismaErrorHandler";
import errorHandler from "./middleware/errorHandler";
import SubtaskController from "./controllers/SubtaskController";
import TaskController from "./controllers/TaskController";

const controllers = [
    new AuthController(),
    new SubtaskController(),
    new TaskController()
];
const globalMiddleware = [cookieParser(), json(), cors({ credentials: true, origin: process.env.FRONTEND_URL })];
const errorHandlers = [prismaErrorHandler, errorHandler];

new Server(controllers, globalMiddleware, errorHandlers).startServer();