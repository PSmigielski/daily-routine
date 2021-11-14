import express, { Express } from "express";
import cors from "cors";
import dotenv from "dotenv";
import errorHandler from "./middleware/errorHandler";
import authRouter from "./routers/Auth.router";

dotenv.config();
const app: Express = express();
app.use(express.json());
app.use(cors());
app.use("/v1/api/auth", authRouter);
app.use(errorHandler);
app.listen(process.env.PORT, () => console.log(`api is running at localhost:${process.env.PORT}`));