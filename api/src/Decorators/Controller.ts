import "reflect-metadata";
import IRoute from "../Types/IRoute";
import Container from "typedi";
import { Router } from "express";

export const router = Router();

export const Controller = (prefix: string): ClassDecorator => {
	return (target: any) => {
		if (!Container.has(target)) Container.set(target);
		Reflect.defineMetadata("prefix", prefix, target.constructor);
		if (!Reflect.hasMetadata("routes", target.constructor)) {
			Reflect.defineMetadata("routes", [], target.constructor);
		}
		const routes = Reflect.getMetadata(
			"routes",
			target.constructor,
		) as Array<IRoute>;
		const instance: any = Container.get(target);
		routes.forEach((route) => {
			router[route.method](
				`${prefix}${route.path}`,
				instance[route.handler].bind(instance),
			);
		});
	};
};
