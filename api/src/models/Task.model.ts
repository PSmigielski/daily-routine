import e from "express";
import ApiErrorException from "../exceptions/ApiErrorException";
import PrismaException from "../exceptions/PrismaException";
import paginationService from "../services/paginationService";
import Model from "./Model";

class Task extends Model{
    private name: string;
    private description: string | undefined;
    private createdAt: Date;
    private repeatEvery: number;
    private lastRepetition: Date | undefined;
    private userId: string;
    constructor(name: string, userId:string, repeatEvery: number, description?: string | undefined, ){
        super();
        this.name = name;
        this.createdAt = new Date();
        this.repeatEvery = repeatEvery;
        this.lastRepetition = this.repeatEvery != 0 ? new Date() : undefined;
        this.userId = userId;
        if(typeof description === "string"){
            this.description = description;
        }
    }
    public async createTask(){
        
        const task = await this.prisma.task.create({
            data: {
                name: this.name,
                createdAt: this.createdAt,
                description: this.description,
                authorId: this.userId,
                lastRepetition: this.lastRepetition,
                repeatEvery: this.repeatEvery
            }
        }).catch(err => { throw PrismaException.createException(err,"Task") });
        console.log(task);
        return task;
    }
    public static async getTasks(userId: string, page: number){
        
        const limit = 25;
        const count = await this.prisma.task.count()
        .catch(err => { throw PrismaException.createException(err,"Task") });
        const totalPages = Math.floor(count/limit)
        paginationService(page, limit, count);
        const tasks = await this.prisma.task.findMany({ 
            take: limit,
            skip: page*limit,
            where: { authorId: userId },
            orderBy: { createdAt: "asc"}
        }).catch(err => { throw PrismaException.createException(err,"Task") })
        return {
            totalCount: count,
            currentCount: tasks.length,
            page,
            totalPages,
            tasks
        };
    }
    public static async getTask(taskId: string){
        
        const task = await this.prisma.task.findUnique({ where:{ id: taskId }})
        .catch(err => { throw PrismaException.createException(err,"Task") })
        if(!task){
            throw new ApiErrorException("task with this id does not exist!", 404)
        }
        return task;
    }
    public static async editTask(taskId: string, userId: string,data: {
        name?: string, 
        description?: string, 
        repeatEvery?: number,
        lastRepetition?: Date | null
    }){
        
        if(await Task.checkOwnerOfTheTask(taskId, userId)){
            if(data.repeatEvery == 0){
                data.lastRepetition = null;
            }else{
                data.lastRepetition = new Date();
            }
            const updatedTask = this.prisma.task.update({
                data,
                where: { id: taskId }
            }).catch(err => { throw PrismaException.createException(err,"Task") })
            return updatedTask;
        }
    }
    public static async removeTask(taskId:string, userId: string){
        
        if(await Task.checkOwnerOfTheTask(taskId, userId)){
            const deletedTask = await this.prisma.task.delete({
                where: { id: taskId }
            }).catch(err => { throw PrismaException.createException(err,"Task") });
            return deletedTask;
        }
    }
    private static async getTaskAuthorById(taskId: string){
        
        const task = await this.prisma.task.findUnique({
            where: {id: taskId},
            select: { authorId: true }
        }).catch(err => { throw PrismaException.createException(err,"Task") });
        if(!task){
            throw new ApiErrorException("task with this id does not exist", 404);
        }
        return task;
    }
    public static async getTaskById(taskId: string){
        
        const task = await this.prisma.task.findUnique({
            where: {id: taskId},
        }).catch(err => { throw PrismaException.createException(err,"Task") });
        if(!task){
            throw new ApiErrorException("task with this id does not exist", 404);
        }
        return task;
    }
    public static async checkOwnerOfTheTask(taskId:string, userId: string){
        const task = await Task.getTaskAuthorById(taskId);
        if(userId !== task?.authorId){
            throw new ApiErrorException("this task does not belong to you", 403);
        }
        return true;
    }
    private static async getTaskStatus(taskId: string){
        
        const task = await this.prisma.task.findUnique({
            where: { id: taskId },
            select: { isDone: true }
        }).catch(err => { throw PrismaException.createException(err,"Task") })
        if(!task){
            throw new ApiErrorException("task with this id does not exist", 404);
        }
        return task?.isDone;
    }
    public static async setHasSubtask(taskId: string, status: boolean){
        
        const updatedTask = await this.prisma.task.update({
            where:{id:taskId}, 
            data:{hasSubtasks: status}
        }).catch(err => { throw PrismaException.createException(err,"Task") });
        return updatedTask
    }
    public static async checkIfTaskHasSubtasks(taskId: string){
        
        const task = await this.prisma.task.findUnique({
            where:{id:taskId},
            select:{hasSubtasks:true}
        }).catch(err => { throw PrismaException.createException(err,"Task") });
        if(!task){
            throw new ApiErrorException("task with this id does not exist", 404);
        }
        return task.hasSubtasks;
    }
    private static async changeTaskStatus(taskId: string){
        
        const task = await Task.getTaskById(taskId);
        const taskStatus = await Task.getTaskStatus(taskId);
        const completedAt: Date | null = taskStatus ? null : new Date();
        const lastRepetition: Date | null = task.repeatEvery != 0 && !taskStatus ? new Date() : null;
        const updatedTask = await this.prisma.task.update({
            where: { id: taskId },
            data: { isDone: !taskStatus, completedAt, lastRepetition: lastRepetition}
        }).catch(err => { throw PrismaException.createException(err,"Task") })
        return updatedTask;
    }
    public static async markTaskAsDoneOrUndone(taskId: string, userId: string, areAllSubtaskDone: boolean = false){
        
        if(await Task.checkOwnerOfTheTask(taskId, userId)){
            if(await Task.checkIfTaskHasSubtasks(taskId)){
                if(areAllSubtaskDone){
                    return await this.changeTaskStatus(taskId);
                }else{
                    throw new ApiErrorException("You should complete all subtasks to mark task as done!", 403);
                }
            }else{
                return await this.changeTaskStatus(taskId);
            }
        }
    }
};

export default Task;