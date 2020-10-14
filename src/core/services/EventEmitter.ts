import {Subscription} from "./Subscription";

export type CallbackType<T> = (data: T) => void;

export class EventEmitter<T> {
    private idCounter: number = 0;
    private _subscriptions: Map<number, CallbackType<T>> = new Map<number, CallbackType<T>>();

    private get subscriptions() {
        return this._subscriptions;
    }

    public emit = (data: T) => {
        for (const callback of this.subscriptions.values()) {
            callback(data);
        }
    };

    public subscribe = (callback: CallbackType<T>) => {
        const newId = this.idCounter++;
        const subscription = new Subscription(() => this.unsubscribe(newId));
        this.subscriptions.set(newId, callback);
        return subscription;
    };

    private unsubscribe = (id: number) => {
        const wasPresent = this._subscriptions.delete(id);
        if (!wasPresent) {
            console.warn("Event to unsubscribe was not found");
        }
    };
}