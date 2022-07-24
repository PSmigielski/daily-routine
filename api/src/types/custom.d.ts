import { JwtPayload } from "jsonwebtoken";
import IIpData from "./IIpData";

declare module 'express-serve-static-core' {
    interface Request {
        user?: JwtPayload | undefined;
        ipData: IIpData | undefined;
    }
}