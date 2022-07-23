import e from "express";
import PrismaException from "../exceptions/PrismaException";
import Model from "./Model";

class Country extends Model{
    private name: string;
    public constructor(name: string ){
        super();
        this.name = name;
    }
    public async creaateCountry(){
        const country = await this.prisma.country
            .create({ data: { name: this.name } })
            .catch((err) => {
                throw PrismaException.createException(err, "Country");
            });
        return country;
    }
    public static async getCountry(id: string){
        const country = await this.prisma.country.findUnique({where: {id}}).catch(err => {
            throw PrismaException.createException(err, "Country")
        });
        return country;
    }
    public static async getCountries(){
        const countries = await this.prisma.country.findMany().catch((err) => {
            throw PrismaException.createException(err, "Country");
        });
        return countries;
    }
}

export default Country;