import express from "express";
import AuthController from "../controllers/AuthController";
import checkJwt from "../middleware/checkJwt";
import schemaValidator from "../middleware/schemaValidator";
import errorHandler from "../middleware/errorHandler";

const authRouter = express.Router();

const authController = new AuthController();
authRouter.post("/register", schemaValidator("/../../schemas/register.schema.json"), authController.register.bind(authController));
authRouter.post("/login", schemaValidator("/../../schemas/login.schema.json"), authController.login.bind(authController));
authRouter.post("/logout", checkJwt, authController.logout.bind(authController));
authRouter.get("/verify/:id", authController.verify.bind(authController));
authRouter.post("/refresh", authController.refreshToken.bind(authController));


export default authRouter;