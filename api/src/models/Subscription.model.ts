import PrismaException from "../exceptions/PrismaException";
import Model from "./Model";

class Subscription extends Model{
    private userId: string;
    private endpoint: string;
    private expirationDate: Date;
    private keys: object;
    constructor(userId: string, endpoint: string, expirationDate: Date, keys:object){
        super();
        this.userId = userId;
        this.endpoint = endpoint;
        this.expirationDate =expirationDate;
        this.keys = keys;
    }
    public async create(){
        const subscription = await this.prisma.subscription
            .create({
                data: {
                    userId: this.userId,
                    endpoint: this.endpoint,
                    expirationTime: this.expirationDate,
                    keys: this.keys,
                },
            })
            .catch((err) => {
                throw PrismaException.createException(
                    err, "Subscription"
                );
            });
        if(subscription){
            return subscription;
        }
    }
    public static async remove(endpoint:string){
        const subscription = await this.prisma.subscription
            .delete({ where: { endpoint } })
            .catch((err) => {
                throw PrismaException.createException(err, "Subscription");
            });
        if(subscription){
            return subscription;
        }
    }
}

export default Subscription;