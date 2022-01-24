import PrismaException from "../exceptions/PrismaException";
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
};

export default Task;