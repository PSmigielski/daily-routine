import { nil, str } from "ajv";
import ApiErrorException from "../Exceptions/ApiErrorException";
import PrismaException from "../Exceptions/PrismaException";
import paginationService from "../Services/paginationService";
import Model from "./Model";
import Subtask from "./Subtask.model";

class Task extends Model {
	private name: string;
	private description: string | undefined;
	private createdAt: Date;
	private repeatEvery: number;
	private lastRepetition: Date | undefined;
	private userId: string;
	constructor(
		name: string,
		userId: string,
		repeatEvery: number,
		description?: string | undefined,
	) {
		super();
		this.name = name;
		this.createdAt = new Date();
		this.repeatEvery = repeatEvery;
		this.lastRepetition = this.repeatEvery != 0 ? new Date() : undefined;
		this.userId = userId;
		if (typeof description === "string") {
			this.description = description;
		}
	}
	public async createTask() {
		const task = await this.prisma.task
			.create({
				data: {
					name: this.name,
					createdAt: this.createdAt,
					description: this.description,
					authorId: this.userId,
					lastRepetition: this.lastRepetition,
					repeatEvery: this.repeatEvery,
				},
			})
			.catch((err) => {
				throw PrismaException.createException(err, "Task");
			});
		return task;
	}
	public static async getTasks(userId: string, page: number) {
		const limit = 25;
		const count = await this.prisma.task.count().catch((err) => {
			throw PrismaException.createException(err, "Task");
		});
		const totalPages = Math.floor(count / limit);
		paginationService(page, limit, count);
		const tasks = await this.prisma.task
			.findMany({
				take: limit,
				skip: page * limit,
				where: { authorId: userId },
				orderBy: { createdAt: "asc" },
			})
			.catch((err) => {
				throw PrismaException.createException(err, "Task");
			});
		return {
			totalCount: count,
			currentCount: tasks.length,
			page,
			totalPages,
			tasks,
		};
	}
	public static async getTask(taskId: string) {
		const task = await this.prisma.task
			.findUnique({ where: { id: taskId } })
			.catch((err) => {
				throw PrismaException.createException(err, "Task");
			});
		if (!task) {
			throw new ApiErrorException(
				"task with this id does not exist!",
				404,
			);
		}
		return task;
	}
	public static async editTask(
		taskId: string,
		userId: string,
		data: {
			name?: string;
			description?: string;
			repeatEvery?: number;
			lastRepetition?: Date | null;
		},
	) {
		if (await Task.checkOwnerOfTheTask(taskId, userId)) {
			if (data.repeatEvery == 0) {
				data.lastRepetition = null;
			} else {
				data.lastRepetition = new Date();
			}
			const updatedTask = this.prisma.task
				.update({
					data,
					where: { id: taskId },
				})
				.catch((err) => {
					throw PrismaException.createException(err, "Task");
				});
			return updatedTask;
		}
	}
	public static async removeTask(taskId: string, userId: string) {
		if (await Task.checkOwnerOfTheTask(taskId, userId)) {
			const deletedTask = await this.prisma.task
				.delete({
					where: { id: taskId },
				})
				.catch((err) => {
					throw PrismaException.createException(err, "Task");
				});
			return deletedTask;
		}
	}
	private static async getTaskAuthorById(taskId: string) {
		const task = await this.prisma.task
			.findUnique({
				where: { id: taskId },
				select: { authorId: true },
			})
			.catch((err) => {
				throw PrismaException.createException(err, "Task");
			});
		if (!task) {
			throw new ApiErrorException(
				"task with this id does not exist",
				404,
			);
		}
		return task;
	}
	public static async getTaskById(taskId: string) {
		const task = await this.prisma.task
			.findUnique({
				where: { id: taskId },
			})
			.catch((err) => {
				throw PrismaException.createException(err, "Task");
			});
		if (!task) {
			throw new ApiErrorException(
				"task with this id does not exist",
				404,
			);
		}
		return task;
	}
	public static async checkOwnerOfTheTask(taskId: string, userId: string) {
		const task = await Task.getTaskAuthorById(taskId);
		if (userId !== task?.authorId) {
			throw new ApiErrorException(
				"this task does not belong to you",
				403,
			);
		}
		return true;
	}
	private static async getTaskStatus(taskId: string) {
		const task = await this.prisma.task
			.findUnique({
				where: { id: taskId },
				select: { isDone: true },
			})
			.catch((err) => {
				throw PrismaException.createException(err, "Task");
			});
		if (!task) {
			throw new ApiErrorException(
				"task with this id does not exist",
				404,
			);
		}
		return task?.isDone;
	}
	public static async setHasSubtask(taskId: string, status: boolean) {
		const updatedTask = await this.prisma.task
			.update({
				where: { id: taskId },
				data: { hasSubtasks: status },
			})
			.catch((err) => {
				throw PrismaException.createException(err, "Task");
			});
		return updatedTask;
	}
	public static async checkIfTaskHasSubtasks(taskId: string) {
		const task = await this.prisma.task
			.findUnique({
				where: { id: taskId },
				select: { hasSubtasks: true },
			})
			.catch((err) => {
				throw PrismaException.createException(err, "Task");
			});
		if (!task) {
			throw new ApiErrorException(
				"task with this id does not exist",
				404,
			);
		}
		return task.hasSubtasks;
	}
	private static async changeTaskStatus(taskId: string) {
		const task = await Task.getTaskById(taskId);
		const taskStatus = await Task.getTaskStatus(taskId);
		const completedAt: Date | null = taskStatus ? null : new Date();
		const lastRepetition: Date | null =
			task.repeatEvery != 0 && !taskStatus ? new Date() : null;
		const updatedTask = await this.prisma.task
			.update({
				where: { id: taskId },
				data: {
					isDone: !taskStatus,
					completedAt,
					lastRepetition: lastRepetition,
				},
			})
			.catch((err) => {
				throw PrismaException.createException(err, "Task");
			});
		return updatedTask;
	}
	public static async getRepeatingTasksForUser(userId: string) {
		const tasks = await this.prisma.task
			.findMany({
				where: {
					authorId: userId,
					repeatEvery: { not: undefined },
				},
			})
			.catch((err) => {
				throw PrismaException.createException(err, "Task");
			});
		if (tasks) return tasks;
	}
	private static async getResetDate(taskId: string) {
		const task = await this.prisma.task
			.findUnique({
				where: { id: taskId },
				select: {
					repeatEvery: true,
					completedAt: true,
					lastRepetition: true,
				},
			})
			.catch((err) => {
				throw PrismaException.createException(err, "Task");
			});
		task?.lastRepetition?.setHours(0, 0, 0, 0);
		const resetDate = task?.lastRepetition;
		const modifiedDate = resetDate;
		modifiedDate?.setDate(
			modifiedDate.getDate() + (task?.repeatEvery as number),
		);
		const today = new Date();
		today.setHours(0, 0, 0, 0);
		if ((modifiedDate as Date) <= today) {
			return today.toDateString();
		} else {
			return null;
		}
	}
	public static async resetTask(taskId: string) {
		const today = new Date().toDateString();
		const resetDay = await this.getResetDate(taskId);
		if (today == resetDay) {
			if (await Task.checkIfTaskHasSubtasks(taskId)) {
				if (await Subtask.checkIfAllSubtaskAreDone(taskId)) {
					await Task.markTaskAsUndone(taskId).catch((err) => {
						throw PrismaException.createException(err, "Task");
					});
				} else {
					await Task.resetStreak(taskId);
				}
				return await Task.markAllSubtaskAsUndone(taskId).catch(
					(err) => {
						throw PrismaException.createException(err, "Task");
					},
				);
			} else {
				return await Task.markTaskAsUndone(taskId).catch((err) => {
					throw PrismaException.createException(err, "Task");
				});
			}
		}
	}
	private static async markAllSubtaskAsUndone(taskId: string) {
		const data = await this.prisma.subtask
			.updateMany({
				where: { taskId },
				data: { isDone: false, completedAt: null },
			})
			.catch((err) => {
				throw PrismaException.createException(err, "Task");
			});
		return data;
	}
	private static async increaseStreak(id: string, streak: number) {
		const data = await this.prisma.task
			.update({ where: { id }, data: { streak: streak + 1 } })
			.catch((err) => {
				throw PrismaException.createException(err, "Task");
			});
		return data;
	}
	private static async resetStreak(id: string) {
		const data = await this.prisma.task
			.update({ where: { id }, data: { streak: 0 } })
			.catch((err) => {
				throw PrismaException.createException(err, "Task");
			});
		return data;
	}
	private static async markTaskAsUndone(taskId: string) {
		const task = await this.getTaskById(taskId).catch((err) => {
			throw err;
		});
		if (task.isDone) {
			this.increaseStreak(taskId, task.streak);
		} else {
			this.resetStreak(taskId);
		}
		const updatedTask = await this.prisma.task
			.update({
				where: { id: taskId },
				data: {
					isDone: false,
					completedAt: undefined,
					lastRepetition: new Date(),
				},
			})
			.catch((err) => {
				throw PrismaException.createException(err, "Task");
			});
		return updatedTask;
	}
	public static async markTaskAsDoneOrUndone(
		taskId: string,
		userId: string,
		areAllSubtaskDone: boolean = false,
	) {
		if (await Task.checkOwnerOfTheTask(taskId, userId)) {
			if (await Task.checkIfTaskHasSubtasks(taskId)) {
				if (areAllSubtaskDone) {
					return await this.changeTaskStatus(taskId);
				} else {
					throw new ApiErrorException(
						"You should complete all subtasks to mark task as done!",
						403,
					);
				}
			} else {
				return await this.changeTaskStatus(taskId);
			}
		}
	}
}

export default Task;
