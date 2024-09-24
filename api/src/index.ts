import { json } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import Server from "./Config/Server";
import AuthController from "./Controllers/AuthController";
import prismaErrorHandler from "./Middleware/prismaErrorHandler";
import errorHandler from "./Middleware/errorHandler";
import SubtaskController from "./Controllers/SubtaskController";
import TaskController from "./Controllers/TaskController";
import CountryController from "./Controllers/CountryController";

const controllers = [
	new AuthController(),
	new SubtaskController(),
	new TaskController(),
	new CountryController(),
];
const globalMiddleware = [
	cookieParser(),
	json(),
	cors({ credentials: true, origin: process.env.FRONTEND_URL }),
];
const errorHandlers = [prismaErrorHandler, errorHandler];

new Server(globalMiddleware, errorHandlers).startServer();
