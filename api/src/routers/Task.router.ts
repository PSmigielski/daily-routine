import express from "express";
import TaskController from "../controllers/TaskController";
import checkJwt from "../middleware/checkJwt";
import schemaValidator from "../middleware/schemaValidator";
const taskRouter = express.Router();

const taskController = new TaskController();
taskRouter.post("",checkJwt, schemaValidator("/../../schemas/createTask.schema.json"),taskController.create.bind(taskController));

export default taskRouter;