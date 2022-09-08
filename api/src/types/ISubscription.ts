interface ISubscription {
    endpoint: string,
    expirationTime: Date,
    keys: {
        auth: string,
        p256dh: string
    };
}

export default ISubscription;