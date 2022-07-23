import Timezone from "../models/Timezone.model";
import ITimezone from "../types/ITimezone";
import Service from "./Service";

class TimezoneService extends Service{
    constructor(){
        super();
    }
    public async create({name, offset, countryId}: ITimezone){
        const timezone = new Timezone(name, offset, countryId).create().catch(this.throwError);
        return timezone;
    }
}

export default TimezoneService