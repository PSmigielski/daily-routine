import { NextFunction, Request, Response } from "express";
import checkJwt from "../Middleware/checkJwt";
import schemaValidator from "../Middleware/schemaValidator";
import Task from "../Models/Task.model";
import ITask from "../Types/ITask";
import { Methods as MethodsEnum } from "../Types/Methods";
import { Controller } from "../Decorators/Controller";
import { Methods } from "../Decorators/Methods";
import checkUuid from "../Middleware/checkUuid";
import { Service } from "typedi";

@Controller("/tasks")
@Service()
class TaskController {
	@Methods("", MethodsEnum.POST, [
		checkJwt,
		schemaValidator("/../../schemas/createTask.schema.json"),
	])
	public async create(req: Request, res: Response, next: NextFunction) {
		const { name, description, repeatEvery = 0 }: ITask = req.body;
		const userId = req.user?.id;
		const task = await new Task(name, userId, repeatEvery, description)
			.createTask()
			.catch(next);
		res.status(201).json({ message: "Task created successfully", task });
	}
	@Methods("", MethodsEnum.GET, [checkJwt])
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
	@Methods("/:taskId", MethodsEnum.GET, [checkJwt, checkUuid("taskId")])
	public async findOneTask(req: Request, res: Response, next: NextFunction) {
		const taskId: string = req.params.taskId;
		const task = await Task.getTask(taskId).catch(next);
		if (task) {
			res.status(200).json(task);
		}
	}

	@Methods("/:taskId", MethodsEnum.PUT, [
		checkJwt,
		checkUuid("taskId"),
		schemaValidator("/../../schemas/editTask.schema.json"),
	])
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
	@Methods("/:taskId", MethodsEnum.DELETE, [checkJwt, checkUuid("taskId")])
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
	@Methods("/mark/:taskId", MethodsEnum.PUT, [checkJwt, checkUuid("taskId")])
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
