import express, { Express } from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();
const app: Express = express();
app.use(express.json());
app.use(cors());
app.get("/v1/api", (req, res) => {
    res.json({ hello: "world" })
});
app.listen(process.env.PORT, () => console.log(`api is running at localhost:${process.env.PORT}`));