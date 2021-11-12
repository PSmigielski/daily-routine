import express, { Express } from "express";
import cors from "cors";
import dotenv from "dotenv";
import ApiErrorException from "./Exceptions/ApiErrorException";
import errorHandler from "./middleware/errorHandler";

dotenv.config();
const app: Express = express();
app.use(express.json());
app.use(cors());

app.get("/v1/api", (req, res) => {
    throw new ApiErrorException("test", 400);
});

app.use(errorHandler);

app.listen(process.env.PORT, () => console.log(`api is running at localhost:${process.env.PORT}`));