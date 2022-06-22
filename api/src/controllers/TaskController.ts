import { NextFunction, Request, Response } from "express";
import checkJwt from "../middleware/checkJwt";
import schemaValidator from "../middleware/schemaValidator";
import Task from "../models/Task.model";
import ITask from "../types/ITask";
import { Methods } from "../types/Methods";
import Controller from "./Controller";

class TaskController extends Controller {
    public path = "/tasks";
    public routes = [
        {
            path: "",
            method: Methods.POST,
            handler: this.create,
            localMiddleware: [
                checkJwt,
                schemaValidator("/../../schemas/createTask.schema.json"),
            ],
        },
        {
            path: "",
            method: Methods.GET,
            handler: this.findAllTasksForUser,
            localMiddleware: [checkJwt],
        },
        {
            path: "/:taskId",
            method: Methods.GET,
            handler: this.findOneTask,
            localMiddleware: [checkJwt],
        },
        {
            path: "/:taskId",
            method: Methods.DELETE,
            handler: this.removeTask,
            localMiddleware: [
                checkJwt,
                schemaValidator("/../../schemas/createTask.schema.json"),
            ],
        },
        {
            path: "/:taskId",
            method: Methods.PUT,
            handler: this.editTask,
            localMiddleware: [
                checkJwt,
                schemaValidator("/../../schemas/editTask.schema.json"),
            ],
        },
        {
            path: "/mark/:taskId",
            method: Methods.PUT,
            handler: this.markTaskAsDoneOrUndone,
            localMiddleware: [checkJwt],
        },
    ];
    public async create(req: Request, res: Response, next: NextFunction) {
        const { name, description, repeatEvery = 0 } : ITask = req.body;
        const userId = req.user?.id;
        const task = await new Task(name, userId, repeatEvery, description)
            .createTask()
            .catch(next);
        res.status(201).json({ message: "Task created successfully", task });
    }
    public async findAllTasksForUser(
        req: Request,
        res: Response,
        next: NextFunction,
    ) {
        const userId = req.user?.id;
        const page: number = req.query.page
            ? parseInt(req.query.page as string, 10)
            : 0;
        const tasks = await Task.getTasks(userId, page).catch(next);
        if (tasks) {
            res.status(200).json(tasks);
        }
    }
    public async findOneTask(req: Request, res: Response, next: NextFunction) {
        const taskId: string = req.params.taskId;
        const task = await Task.getTask(taskId).catch(next);
        if (task) {
            res.status(200).json(task);
        }
    }
    public async editTask(req: Request, res: Response, next: NextFunction) {
        const taskId: string = req.params.taskId;
        const userId: string = req.user?.id;
        const data: {
            name?: string;
            description?: string;
            repeatEvery: number;
        } = req.body;
        const task = await Task.editTask(taskId, userId, data).catch(next);
        if (task) {
            res.status(200).json({ message: "task edited successfully", task });
        }
    }
    public async removeTask(req: Request, res: Response, next: NextFunction) {
        const taskId: string = req.params.taskId;
        const userId: string = req.user?.id;
        const task = await Task.removeTask(taskId, userId).catch(next);
        if (task) {
            res.status(200).json({
                message: "task deleted successfully",
                task,
            });
        }
    }
    public async markTaskAsDoneOrUndone(
        req: Request,
        res: Response,
        next: NextFunction,
    ) {
        const taskId: string = req.params.taskId;
        const userId: string = req.user?.id;
        const task = await Task.markTaskAsDoneOrUndone(taskId, userId).catch(
            next,
        );
        if (task) {
            res.status(200).json({
                message: "task updated successfully",
                task,
            });
        }
    }
}

export default TaskController;