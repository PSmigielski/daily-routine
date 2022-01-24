import { NextFunction, Request, Response } from "express";
import Task from "../models/Task.model";

class TaskController{
    public async create(req: Request, res: Response, next: NextFunction){
        const { name, description }: { name: string, description: string | undefined } = req.body;
        const userId = req.user?.id;
        const task = await new Task(name, userId ,description).createTask().catch(next);
        res.status(201).json({message: "Task created successfully", task});
    }
}

export default TaskController;