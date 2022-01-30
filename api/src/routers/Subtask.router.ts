import express from "express";
import SubtaskController from "../controllers/SubtaskController";
import checkJwt from "../middleware/checkJwt";
import schemaValidator from "../middleware/schemaValidator";

const subtaskRouter = express.Router();
const subtaskController = new SubtaskController();

subtaskRouter.post("/:taskId", checkJwt, schemaValidator("/../../schemas/createSubtask.schema.json"), subtaskController.create.bind(subtaskController));
subtaskRouter.get("/:taskId", checkJwt, subtaskController.getSubtasks.bind(subtaskController));

export default subtaskRouter;