import ApiErrorException from "../exceptions/ApiErrorException";
import PrismaException from "../exceptions/PrismaException";
import paginationService from "../services/paginationService";
import Model from "./Model";
import Task from "./Task.model";
import { Task as TaskType}  from "@prisma/client"


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
        
        const subtask = await this.prisma.subtask.create({
            data: {
                name: this.name,
                createdAt: this.createdAt,
                taskId: this.taskId
            }
        }).catch(err => {throw PrismaException.createException(err, "Subtask")});
        return subtask;
    }
    public static async getSubtasks(task: TaskType, page: number){
        
        const limit = 25;
        const count = await this.prisma.subtask.count({where:{task}})
        .catch(err => { throw PrismaException.createException(err,"Subtask") });
        const totalPages = Math.floor(count/limit)
        paginationService(page, limit, count);
        const subtasks = await this.prisma.subtask.findMany({
            take: limit,
            skip: page*limit,
            where:{task},
            orderBy: { createdAt: "asc"}
        }).catch(err => { throw PrismaException.createException(err,"Subtask") })
        return {
            totalCount: count,
            currentCount: subtasks.length,
            page,
            totalPages,
            subtasks
        }
    }
    public static async getSubtaskById(subtaskId: string){
        
        const subtask = await this.prisma.subtask.findUnique({where:{id:subtaskId}})
        .catch(err => { throw PrismaException.createException(err,"Task") })
        if(!subtask){
            throw new ApiErrorException("Subtask with this id does not exist!", 404);
        }
        return subtask;
    }
    public static async checkOwnerOfTheSubtask(subtaskId: string, userId: string){
        const subtask = await Subtask.getSubtaskById(subtaskId);
        return await Task.checkOwnerOfTheTask(subtask.taskId, userId);
    }
    public static async editSubtask(subtaskId: string, name: string){
        
        const updatedSubtask = await this.prisma.subtask.update({
            where: {id: subtaskId},
            data: { name }
        }).catch(err => { throw PrismaException.createException(err,"Subtask") })
        return updatedSubtask;
    }
    public static async removeSubtask(subtaskId: string){
        const removedSubtask = await this.prisma.subtask.delete({where: {id: subtaskId}})
        .catch(err => { throw PrismaException.createException(err,"Subtask") })
        return removedSubtask;
    }
    private static async checkIfAllSubtaskAreDone(taskId: string){
        
        const allSubtasksInTaskCount = await this.prisma.subtask.count({where: {taskId}})
        .catch(err => { throw PrismaException.createException(err,"Subtask") });
        const allDoneSubtaskInTaskCount = await this.prisma.subtask.count({where: {taskId, isDone: true}})
        .catch(err => { throw PrismaException.createException(err,"Subtask") });
        return allDoneSubtaskInTaskCount === allSubtasksInTaskCount;
    }
    public static async markTaskAsDoneOrUndone(subtaskId: string, userId: string){
        
        const subtask = await Subtask.getSubtaskById(subtaskId)
        if(await Task.checkOwnerOfTheTask(subtask.taskId, userId)){
            const subtaskStatus = subtask.isDone;
            const completedAt: Date | null = subtaskStatus ? null : new Date();
            const updatedSubtask = await this.prisma.subtask.update({
                where: { id: subtaskId },
                data: { isDone: !subtaskStatus, completedAt}
            }).catch(err => { throw PrismaException.createException(err,"Subtask") })
            const isAllSubtasksDone = await Subtask.checkIfAllSubtaskAreDone(subtask.taskId);
            if(isAllSubtasksDone){
                const task = await Task.markTaskAsDoneOrUndone(subtask.taskId, userId, isAllSubtasksDone);
                return {updatedSubtask, task};
            }else{
                const task = await Task.markTaskAsDoneOrUndone(subtask.taskId, userId, true);
            }
            return updatedSubtask;
        }
    }
}

export default Subtask;