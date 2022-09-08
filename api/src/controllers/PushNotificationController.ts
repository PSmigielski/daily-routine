import { NextFunction, Request, Response } from "express";
import { Methods } from "../types/Methods";
import Controller from "./Controller";
import webpush from "web-push";
import Subscription from "../models/Subscription.model";
import checkJwt from "../middleware/checkJwt";

class PushNotificationController extends Controller {
    public path = "/subscribe";
    public routes = [
        {
            path: "",
            method: Methods.POST,
            handler: this.create,
            localMiddleware: [checkJwt],
        },
    ];
    public constructor() {
        super();
        webpush.setVapidDetails(
            `mailto:${process.env.APP_EMAIL as string}`,
            process.env.VAPID_PUBLIC_KEY as string,
            process.env.VAPID_PRIVATE_KEY as string,
        );
    }
    public async create(req: Request, res: Response, next: NextFunction) {
        const subscription = req.body;
        const userId = req.user?.id;
        const subscriptionEntity = await new Subscription(
            userId,
            subscription.endpoint,
            subscription.expirationDate,
            subscription.keys,
        )
            .create()
            .catch(next);
        if (subscriptionEntity) {
            return res
                .status(201)
                .json({ message: "subscription has been created" });
        }

    }
}

export default PushNotificationController;