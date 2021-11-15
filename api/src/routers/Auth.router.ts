import express from "express";
import AuthController from "../controllers/AuthController";
import schemaValidator from "../middleware/schemaValidator";

const authRouter = express.Router();

const authController = new AuthController();
authRouter.post("/register", schemaValidator("/../schemas/register.schema.json"), authController.register.bind(authController))
authRouter.get("/verify/:id", authController.verify.bind(authController))


export default authRouter;