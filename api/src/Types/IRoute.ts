import { Methods } from "./Methods";
import { Middleware } from "./Middleware";

interface IRoute {
    path: string;
    method: Methods;
    handler: any;
    localMiddleware: Middleware
}

export default IRoute;
