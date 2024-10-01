import "reflect-metadata";
import IRoute from "../Types/IRoute";
import Container from "typedi";
import { Router } from "express";

export const router = Router();

export const Controller = (prefix: string): ClassDecorator => {
	return (target: any) => {
		console.log("created controller");
		Reflect.defineMetadata("prefix", prefix, target);
		if (!Reflect.hasMetadata("routes", target)) {
			Reflect.defineMetadata("routes", [], target);
		}
		const routes = Reflect.getMetadata("routes", target) as Array<IRoute>;
		const instance: any = Container.get(target);
		routes.forEach((route) => {
			router[route.method](
				`${prefix}${route.path}`,
				instance[route.handler].bind(instance),
			);
		});
	};
};
