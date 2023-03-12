import webpush from "web-push";
import IPayload from "../types/IPayload";
import ISubscription from "../types/ISubscription";
class PushNotificationService {
    constructor() {
        webpush.setVapidDetails(
            `mailto:${process.env.APP_EMAIL as string}`,
            process.env.VAPID_PUBLIC_KEY as string,
            process.env.VAPID_PRIVATE_KEY as string,
        );
    }
    public sendNotification(payload: IPayload, subscription: ISubscription){
        webpush
            .sendNotification(subscription,JSON.stringify(payload))
            .catch((err) => console.error(err));
    }
}
export default PushNotificationService;