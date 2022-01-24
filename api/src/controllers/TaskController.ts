import { NextFunction, Request, Response } from "express";
import Task from "../models/Task.model";

class TaskController{
    public async create(req: Request, res: Response, next: NextFunction){
        const { name, description }: { name: string, description: string | undefined } = req.body;
        const userId = req.user?.id;
        const task = await new Task(name, userId ,description).createTask().catch(next);
        res.status(201).json({message: "Task created successfully", task});
    }
    public async findAllForUser(req: Request, res: Response, next: NextFunction){
        const userId = req.user?.id;
        const page: number  = req.query.page ? parseInt(req.query.page as string, 10) : 0;
        const tasks = await Task.getTasks(userId, page).catch(next);
        if(tasks){
            res.status(200).json(tasks);
        }
    }
    public async findOneTask(req: Request, res: Response, next: NextFunction){
        const taskId: string = req.params.taskId;
        const task = await Task.getTask(taskId).catch(next);
        if(task){
            res.status(200).json(task);
        }
    }
}

export default TaskController;