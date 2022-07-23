import PrismaException from "../exceptions/PrismaException";
import ITimezone from "../types/ITimezone";
import Model from "./Model";

class Timezone extends Model{
    private name: string;
    private offset: number;
    private countryId: string
    constructor(name: string, offset: number, countryId: string){
        super();
        this.name = name;
        this.offset = offset;
        this.countryId = countryId;
    }
    public static async create(data: Array<ITimezone>){
        const timezone = await this.prisma.timezone.createMany({data}).catch((err) => {
            throw PrismaException.createException(err, "Timezone");
        });
    }
}

export default Timezone