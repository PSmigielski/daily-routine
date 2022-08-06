import Country from "../models/Country.model";
import ICountry from "../types/ICountry";
import Service from "./Service";

class CountryService extends Service{
    public async createMany(countries: Array<ICountry>){
        const country = Country.createCountries(countries).catch(this.throwError);
        return country;
    }
    public async getCountries(){
        const countries = Country.getCountries().catch(this.throwError);
        return countries;
    }
}

export default CountryService;