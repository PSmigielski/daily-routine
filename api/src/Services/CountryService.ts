import Country from "../Models/Country.model";
import ICountry from "../Types/ICountry";
import Service from "./Service";

class CountryService extends Service {
	public async createMany(countries: Array<ICountry>) {
		const country = Country.createCountries(countries).catch(
			this.throwError,
		);
		return country;
	}
	public async getCountries() {
		const countries = Country.getCountries().catch(this.throwError);
		return countries;
	}
}

export default CountryService;
