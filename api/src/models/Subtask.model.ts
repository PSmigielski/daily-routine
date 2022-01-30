import { Task } from "@prisma/client";
import PrismaException from "../exceptions/PrismaException";
import paginationService from "../services/paginationService";
import Model from "./Model";

class Subtask extends Model{
    private name: string;
    private createdAt: Date;
    private taskId: string;
    constructor(name: string, taskId: string){
        super();
        this.name = name;
        this.createdAt = new Date();
        this.taskId = taskId;
    }
    public async createSubtask(){
        const prisma = Subtask.getPrisma();
        const subtask = await prisma.subtask.create({
            data: {
                name: this.name,
                createdAt: this.createdAt,
                taskId: this.taskId
            }
        }).catch(err => {throw PrismaException.createException(err, "Subtask")});
        return subtask;
    }
    public static async getSubtasks(task: Task, page: number){
        const prisma = Subtask.getPrisma();
        const limit = 25;
        const count = await prisma.subtask.count({where:{task}})
        .catch(err => { throw PrismaException.createException(err,"Task") });
        const totalPages = Math.floor(count/limit)
        paginationService(page, limit, count);
        const subtasks = await prisma.subtask.findMany({
            take: limit,
            skip: page*limit,
            where:{task},
            orderBy: { createdAt: "asc"}
        }).catch(err => { throw PrismaException.createException(err,"Task") })
        return {
            totalCount: count,
            currentCount: subtasks.length,
            page,
            totalPages,
            subtasks
        }
    }
}

export default Subtask;