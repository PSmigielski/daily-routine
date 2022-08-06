import { NextFunction, Request, Response } from "express";
import Subtask from "../models/Subtask.model";
import Task from "../models/Task.model";
import {Task as TaskType, Subtask as SubtaskType} from "@prisma/client";
import Controller from "./Controller";
import checkJwt from "../middleware/checkJwt";
import { Methods } from "../types/Methods";
import schemaValidator from "../middleware/schemaValidator";

class SubtaskController extends Controller {
    public path = "/subtasks";
    public routes = [
        {
            path: "/:taskId",
            method: Methods.POST,
            handler: this.create,
            localMiddleware: [
                checkJwt,
                schemaValidator("/../../schemas/subtask.schema.json"),
            ],
        },
        {
            path: "/:subtaskId",
            method: Methods.PUT,
            handler: this.editSubtask,
            localMiddleware: [
                checkJwt,
                schemaValidator("/../../schemas/subtask.schema.json"),
            ],
        },
        {
            path: "/:taskId",
            method: Methods.GET,
            handler: this.getSubtasks,
            localMiddleware: [checkJwt],
        },
        {
            path: "/:subtaskId",
            method: Methods.DELETE,
            handler: this.removeSubtask,
            localMiddleware: [checkJwt],
        },
        {
            path: "/mark/:subtaskId",
            method: Methods.PUT,
            handler: this.markSubtaskAsDoneOrUndone,
            localMiddleware: [checkJwt],
        }
    ];
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