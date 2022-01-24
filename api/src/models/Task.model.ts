import ApiErrorException from "../exceptions/ApiErrorException";
import PrismaException from "../exceptions/PrismaException";
import paginationService from "../services/paginationService";
import Model from "./Model";

class Task extends Model{
    private name: string;
    private description: string | undefined;
    private createdAt: Date;
    private userId: string;
    constructor(name: string, userId:string, description?: string | undefined){
        super();
        this.name = name;
        this.createdAt = new Date();
        this.userId = userId;
        if(typeof description === "string"){
            this.description = description;
        }
    }
    public async createTask(){
        const prisma = Task.getPrisma();
        const task = await prisma.task.create({
            data: {
                name: this.name,
                createdAt: this.createdAt,
                description: this.description,
                authorId: this.userId,
            }
        }).catch(err => { throw PrismaException.createException(err,"Task") });
        return task;
    }
    public static async getTasks(userId: string, page: number){
        const prisma = Task.getPrisma();
        const limit = 25;
        const count = await prisma.task.count()
        .catch(err => { throw PrismaException.createException(err,"Task") });
        const totalPages = Math.floor(count/limit)
        paginationService(page, limit, count);
        const tasks = await prisma.task.findMany({ 
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
        const prisma = Task.getPrisma();
        const task = await prisma.task.findUnique({ where:{ id: taskId }})
        .catch(err => { throw PrismaException.createException(err,"Task") })
        if(!task){
            throw new ApiErrorException("task with this id does not exist!", 404)
        }
        return task;
    }
    public static async editTask(taskId: string, userId: string,data: {name?: string, description?: string}){
        const prisma = Task.getPrisma();
        if(await Task.checkOwnerOfTheTask(taskId, userId)){
            const updatedTask = prisma.task.update({
                data,
                where: { id: taskId }
            }).catch(err => { throw PrismaException.createException(err,"Task") })
            return updatedTask;
        }
    }
    public static async removeTask(taskId:string, userId: string){
        const prisma = Task.getPrisma();
        if(await Task.checkOwnerOfTheTask(taskId, userId)){
            const deletedTask = await prisma.task.delete({
                where: { id: taskId }
            }).catch(err => { throw PrismaException.createException(err,"Task") });
            return deletedTask;
        }
    }
    public static async getTaskAuthorById(taskId: string){
        const prisma = Task.getPrisma();
        const task = await prisma.task.findUnique({
            where: {id: taskId},
            select: { authorId: true }
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
};

export default Task;