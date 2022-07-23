import PrismaException from "../exceptions/PrismaException";
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
    public async create(){
        const timezone = await this.prisma.timezone.create({data:{
            name: this.name, 
            gmtOffset: this.offset, 
            countryId: this.countryId}
        }).catch((err) => {
            throw PrismaException.createException(err, "Timezone");
        });
    }
}

export default Timezone