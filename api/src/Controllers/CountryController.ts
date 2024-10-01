import { NextFunction, Request, Response } from "express";
import checkJwt from "../Middleware/checkJwt";
import CountryService from "../Services/CountryService";
import { Methods as MethodsEnum } from "../Types/Methods";
import { Controller } from "../Decorators/Controller";
import { Methods } from "../Decorators/Methods";
import { Service } from "typedi";

@Controller("/countries")
@Service()
class CountryController {
	@Methods("", MethodsEnum.GET, [checkJwt])
	public async getCountries(req: Request, res: Response, next: NextFunction) {
		const countries = await new CountryService().getCountries().catch(next);
		if (countries) {
			return res.status(201).json({ countries });
		}
	}
}
export default CountryController;
