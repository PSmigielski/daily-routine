import express from "express";
import TaskController from "../controllers/TaskController";
import checkJwt from "../middleware/checkJwt";
import schemaValidator from "../middleware/schemaValidator";
const taskRouter = express.Router();

const taskController = new TaskController();
taskRouter.post("" ,checkJwt ,schemaValidator("/../../schemas/createTask.schema.json") ,taskController.create.bind(taskController));
taskRouter.get("" ,checkJwt ,taskController.findAllTasksForUser.bind(taskController));
taskRouter.get("/:taskId", checkJwt, taskController.findOneTask.bind(taskController));
taskRouter.put("/:taskId", checkJwt,schemaValidator("/../../schemas/editTask.schema.json") ,taskController.editTask.bind(taskController));

export default taskRouter;