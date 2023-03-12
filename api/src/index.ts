import { json } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import Server from "./config/Server";
import AuthController from "./controllers/AuthController";
import prismaErrorHandler from "./middleware/prismaErrorHandler";
import errorHandler from "./middleware/errorHandler";
import SubtaskController from "./controllers/SubtaskController";
import TaskController from "./controllers/TaskController";
import CountryController from "./controllers/CountryController";
import PushNotificationController from "./controllers/PushNotificationController";

const controllers = [
    new AuthController(),
    new SubtaskController(),
    new TaskController(),
    new CountryController(),
    new PushNotificationController()
];
const globalMiddleware = [
    cookieParser(),
    json(),
    cors({ credentials: true, origin: "https://192.168.1.120" }),
];
const errorHandlers = [prismaErrorHandler, errorHandler];

new Server(controllers, globalMiddleware, errorHandlers).startServer();