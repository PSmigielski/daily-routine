import Model from "./Model";

class Country extends Model{
    private name: string;
    private timezone: number;
    public constructor(name: string, timezone:number){
        super();
        this.name = name;
        this.timezone = timezone;
    }
    
}