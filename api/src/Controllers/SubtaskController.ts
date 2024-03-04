import { NextFunction, Request, Response } from "express";
import Subtask from "../Models/Subtask.model";
import Task from "../Models/Task.model";
import {Task as TaskType, Subtask as SubtaskType} from "@prisma/client";
import checkJwt from "../Middleware/checkJwt";
import { Methods as MethodsEnum } from "../Types/Methods";
import schemaValidator from "../Middleware/schemaValidator";
import { Controller } from "../Decorators/Controller";
import { Methods } from "../Decorators/Methods";
import checkUuid from "../Middleware/checkUuid";

@Controller("/subtasks")
class SubtaskController {

    @Methods("/:taskId", MethodsEnum.POST, [checkJwt, checkUuid("taskId"), schemaValidator("/../../schemas/subtask.schema.json")])
    public async create(req: Request, res: Response, next: NextFunction) {
        const { name } = req.body;
        const { taskId } = req.params;
        const task = await Task.getTaskById(taskId).catch(next);
        if (task) {
            const subtask = await new Subtask(name, taskId)
                .createSubtask()
                .catch(next);
            if (!task.hasSubtasks) {
                const updatedTask = await Task.setHasSubtask(
                    taskId,
                    true,
                ).catch(next);
            }
            if (subtask) {
                res.status(201).json({
                    message: "subtask created successfully",
                    subtask,
                });
            }
        }
    }

    @Methods("/:taskId", MethodsEnum.GET, [checkJwt, checkUuid("taskId")])
    public async getSubtasks(req: Request, res: Response, next: NextFunction) {
        const taskId = req.params.taskId;
        const page = req.query.page
            ? parseInt(req.query.page as string, 10)
            : 0;
        const task = await Task.getTaskById(taskId).catch(next);
        if (task) {
            const subtasks = await Subtask.getSubtasks(task, page).catch(next);
            if (subtasks) {
                res.status(200).json(subtasks);
            }
        }
    }

    @Methods("/:subtaskId", MethodsEnum.PUT, [checkJwt, checkUuid("subtaskId"), schemaValidator("/../../schemas/subtask.schema.json")])
    public async editSubtask(req: Request, res: Response, next: NextFunction) {
        const { subtaskId } = req.params;
        const { name } = req.body;
        if (
            await Subtask.checkOwnerOfTheSubtask(subtaskId, req.user?.id).catch(
                next,
            )
        ) {
            const updatedSubtask = await Subtask.editSubtask(
                subtaskId,
                name,
            ).catch(next);
            if (updatedSubtask) {
                return res.status(200).json({
                    message: "subtask has been updated",
                    updatedSubtask,
                });
            }
        }
    }
    @Methods("/:subtaskId", MethodsEnum.DELETE, [checkJwt, checkUuid("subtaskId")])
    public async removeSubtask(
        req: Request,
        res: Response,
        next: NextFunction,
    ) {
        const { subtaskId } = req.params;
        if (
            await Subtask.checkOwnerOfTheSubtask(subtaskId, req.user?.id).catch(
                next,
            )
        ) {
            const removedTask = await Subtask.removeSubtask(subtaskId).catch(
                next,
            );
            if (removedTask) {
                return res.status(200).json({
                    message: "Subtask deleted successfully!",
                    removedTask,
                });
            }
        }
    }

    @Methods("/mark/:subtaskId", MethodsEnum.PUT, [checkJwt, checkUuid("subtaskId")])
    public async markSubtaskAsDoneOrUndone(
        req: Request,
        res: Response,
        next: NextFunction,
    ) {
        const { subtaskId } = req.params;
        const userId: string = req.user?.id;
        const data = await Subtask.markTaskAsDoneOrUndone(
            subtaskId,
            userId,
        ).catch(next);
        if (data) {
            res.status(200).json({
                message: "subtask updated successfully",
                data,
            });
        }
    }
}

export default SubtaskController;
