import User from "../models/User.model";
import cron from "node-cron";
import Task from "../models/Task.model";

class ResetUserTasks {
    public async setup(){
        cron.schedule("0 * * * *", async ()=>{
            const time = new Date();
            const users = await User.getUsersFromTimezones(time.getHours()-1);
            users.forEach(async (el) => {
                const tasks = await Task.getRepeatingTasksForUser(el.id).catch(err => { throw err });
                if(tasks){
                    tasks.forEach(async(el) => {
                        const resetedTasks = await Task.resetTask(el.id).catch(err => { throw err });
                    });
                }
            })
        },{scheduled: true}).start();
    }
}

export default ResetUserTasks;