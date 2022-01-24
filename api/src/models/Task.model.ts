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
        const count = await prisma.task.count();
        const totalPages = Math.floor(count/limit)
        paginationService(page, limit, count);
        const tasks = await prisma.task.findMany({ 
            take: limit,
            skip: page*limit,
            where: { authorId: userId },
            orderBy: { createdAt: "asc"}
        })
        return {
            totalCount: count,
            currentCount: tasks.length,
            page,
            totalPages,
            tasks
        };
    }
};

export default Task;