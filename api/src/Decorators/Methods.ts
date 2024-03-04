import { Methods as MethodsEnum } from "../Types/Methods";
import { Middleware } from "../Types/Middleware";
import 'reflect-metadata';
import IRoute from "../Types/IRoute";

export const Methods = (path: string, method: MethodsEnum, localMiddleware: Middleware) => {
	return (target: any, propertyKey:string) => {
		if(!Reflect.hasMetadata("routes", target.constructor)){
			Reflect.defineMetadata("routes", [], target.constructor);
		}
		const routes = Reflect.getMetadata("routes", target.constructor) as Array<IRoute>
		routes.push({path, method, handler: propertyKey, localMiddleware});
		Reflect.defineMetadata("routes", routes, target.constructor);
	}	
}
