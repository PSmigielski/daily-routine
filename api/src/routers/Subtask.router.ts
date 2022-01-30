import express from "express";
import SubtaskController from "../controllers/SubtaskController";
import checkJwt from "../middleware/checkJwt";
import schemaValidator from "../middleware/schemaValidator";

const subtaskRouter = express.Router();
const subtaskController = new SubtaskController();

subtaskRouter.post("/:taskId", checkJwt, schemaValidator("/../../schemas/subtask.schema.json"), subtaskController.create.bind(subtaskController));
subtaskRouter.put("/:subtaskId", checkJwt, schemaValidator("/../../schemas/subtask.schema.json"), subtaskController.editSubtask.bind(subtaskController));
subtaskRouter.get("/:taskId", checkJwt, subtaskController.getSubtasks.bind(subtaskController));
subtaskRouter.delete("/:subtaskId", checkJwt, subtaskController.removeSubtask.bind(subtaskController));
subtaskRouter.put("/mark/:subtaskId", checkJwt, subtaskController.markSubtaskAsDoneOrUndone.bind(subtaskController));

export default subtaskRouter;