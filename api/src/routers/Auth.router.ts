import express from "express";
import AuthController from "../controllers/AuthController";
import schemaValidator from "../middleware/schemaValidator";

const authRouter = express.Router();

const authController = new AuthController();
authRouter.get("/register", schemaValidator("/../schemas/register.schema.json"), authController.register.bind(authController))

export default authRouter;