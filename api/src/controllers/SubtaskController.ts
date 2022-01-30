import { NextFunction, Request, Response } from "express";
import Subtask from "../models/Subtask.model";
import Task from "../models/Task.model";

class SubtaskController{
    public async create(req: Request, res: Response, next: NextFunction){
        const { name } = req.body;
        const { taskId } = req.params;
        const task = await Task.getTaskById(taskId).catch(next);
        if(task){
            const subtask = await new Subtask(name, taskId).createSubtask().catch(next);
            if(!task.hasSubtasks){
                const updatedTask = await Task.setHasSubtask(taskId, true).catch(next);
            }
            if(subtask){
                res.status(201).json({message: "subtask created successfully", subtask});
            }
        }
    }
    public async getSubtasks(req: Request, res: Response, next: NextFunction){
        const taskId = req.params.taskId;
        const page = req.query.page ? parseInt(req.query.page as string, 10) : 0;
        const task = await Task.getTaskById(taskId).catch(next);
        if(task){
            const subtasks = await Subtask.getSubtasks(task, page).catch(next);
            if(subtasks){
                res.status(200).json(subtasks);
            }
        }
    }
    public async editTask(req: Request, res: Response, next: NextFunction){
        const { subtaskId } = req.params;
        const { name } = req.body
        if(await Subtask.checkOwnerOfTheSubtask(subtaskId, req.user?.id).catch(next)){
            const updatedSubtask = await Subtask.editSubtask(subtaskId, name).catch(next);
            if(updatedSubtask){
                return res.status(200).json({
                    message: "subtasktask has been updated",
                    updatedSubtask
                })
            }
        }
    }
}

export default SubtaskController;