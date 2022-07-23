import e from "express";
import PrismaException from "../exceptions/PrismaException";
import ICountry from "../types/ICountry";
import Model from "./Model";

class Country extends Model{

    public static async createCountries(data: Array<ICountry>){
        const country = await this.prisma.country
            .createMany({ data })
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