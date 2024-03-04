import axios from "axios";
import requestIp from "request-ip";
import { NextFunction, Request, Response } from "express";

const ipInfo = async (req: Request, res: Response, next: NextFunction) => {
    const token = process.env.IPINFO_TOKEN;
    const ip = requestIp.getClientIp(req);
    if(ip == "::1"){
        const { data } = await axios.get(
            `https://ipinfo.io/?token=${token}`,
        );
        req.ipData = data;
        next();
    }
    const { data } = await axios.get(`https://ipinfo.io/${ip}?token=${token}`);
    req.ipData = data;
    next();
}
export default ipInfo;