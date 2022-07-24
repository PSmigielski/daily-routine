import { Country, PrismaClient } from "@prisma/client";
import puppeteer from "puppeteer";
import CountryService from "../services/CountryService";
import TimezoneService from "../services/TimezoneService";
import ICountry from "../types/ICountry";
import ITimezone from "../types/ITimezone";

const url = 'https://timezonedb.com/time-zones';

const fetchData = async () =>{
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(url, {waitUntil: "domcontentloaded"});
    let data: Array<any> = await page.evaluate(() => {
        let items = document.querySelector(".default tbody")?.children;
        let array = [...items as HTMLCollection];
        let countries: Array<ICountry> = [];
        let timezones: Array<ITimezone> = [];
        array.forEach((el: Element) => {
            let info = el.children;
            const country = { id: "", name: ""}
            const timezone = { name: "", gmtOffset: 0, countryId: ""}
            let infoArr = [...info as HTMLCollection];
            infoArr.forEach((el,idx) => {
                switch(idx){
                    case 0:
                        country.id = el.innerHTML;
                        timezone.countryId = el.innerHTML;
                    case 1:
                        country.name = el.innerHTML;
                        
                        break;
                    case 2:
                        timezone.name = el.children[0].innerHTML;
                        break;
                    case 3:
                        let offset = el.innerHTML.slice(4).trim().replace(":", ".").replace("+", "")
                        let num = new Number(offset).valueOf();
                        timezone.gmtOffset = num;
                        break;
                }
            })
            countries.push(country);
            timezones.push(timezone);
        });
        return [timezones, countries];
    });
    browser.close();
    const countries: ICountry[] = Array.from(
        new Set(data[1].map((c: ICountry) => c.name)),
    ).map((name) => {
        return data[1].find((c: ICountry) => c.name === name);
    });
     const timezones: ITimezone[] = Array.from(
         new Set(data[0].map((c: ICountry) => c.name)),
     ).map((name) => {
         return data[0].find((c: ITimezone) => c.name === name);
     }) as ITimezone[];
    const countryObj = await new CountryService().createMany(countries as Array<ICountry>).catch(err=>{throw err});
    //const countriesFromDb = await new CountryService().getCountries().catch(err => {throw err}) as Country[];
    // timezones.forEach((timezone) => {
    //     countriesFromDb.forEach((country: Country) => {
    //         if(country.name == timezone?.countryId){
    //             timezone.countryId = country.id
    //         }
    //     })
    // })
    await new TimezoneService().createMany(timezones).catch(err => {throw err});
    console.log("data has been fetched");
}

fetchData();