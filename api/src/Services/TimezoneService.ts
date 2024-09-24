import Timezone from "../Models/Timezone.model";
import ITimezone from "../Types/ITimezone";
import Service from "./Service";

class TimezoneService extends Service {
	constructor() {
		super();
	}
	public async createMany(data: Array<ITimezone>) {
		const timezone = Timezone.create(data).catch(this.throwError);
		return timezone;
	}
}

export default TimezoneService;
