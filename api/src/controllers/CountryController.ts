import { NextFunction, Request, Response } from "express";
import checkJwt from "../middleware/checkJwt";
import CountryService from "../services/CountryService";
import { Methods } from "../types/Methods";
import Controller from "./Controller";

class CountryController extends Controller {
    public path = "/countries";
    public routes = [{
            path: "",
            method: Methods.GET,
            handler: this.getCountries,
            localMiddleware: [checkJwt],
        }];
    public async getCountries(req: Request, res: Response, next: NextFunction){
        const countries = await new CountryService().getCountries().catch(next);
        if(countries){
            return res.status(201).json({countries})
        }
    }
}
export default CountryController;