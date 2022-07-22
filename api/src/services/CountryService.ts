import Country from "../models/Country.model";
import ICountry from "../types/ICountry";
import Service from "./Service";

class CountryService extends Service{
    public async create({name, timezone}: ICountry){
        const country = new Country(name,timezone).creaateCountry().catch(this.throwError);
        return country;
    }
    public async getCountries(){
        const countries = Country.getCountries().catch(this.throwError);
        return countries;
    }
}

export default CountryService;