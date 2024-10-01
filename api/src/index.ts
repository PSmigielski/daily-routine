import { json } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import Server from "./Config/Server";
import prismaErrorHandler from "./Middleware/prismaErrorHandler";
import errorHandler from "./Middleware/errorHandler";
import "reflect-metadata";

const globalMiddleware = [
	cookieParser(),
	json(),
	cors({ credentials: true, origin: process.env.FRONTEND_URL }),
];
const errorHandlers = [prismaErrorHandler, errorHandler];

new Server(globalMiddleware, errorHandlers).startServer();
