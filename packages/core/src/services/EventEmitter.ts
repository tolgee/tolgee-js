import { Subscription } from './Subscription';

export type CallbackType<T> = (data: T) => Promise<void> | void;

export interface EventEmitter<T> {
  subscribe(callback: CallbackType<T>): Subscription;
}

export class EventEmitterImpl<T> {
  private idCounter = 0;
  private _subscriptions: Map<number, CallbackType<T>> = new Map<
    number,
    CallbackType<T>
  >();

  private get subscriptions() {
    return this._subscriptions;
  }

  public emit(data?: T): Promise<void> | void {
    const promiseReturns = [];
    for (const callback of this.subscriptions.values()) {
      const returned = callback(data);
      if (typeof returned?.['then'] === 'function') {
        promiseReturns.push(returned);
      }
    }

    if (promiseReturns.length === 0) {
      return;
    }

    return new Promise((resolve) =>
      Promise.all(promiseReturns).then(() => resolve())
    );
  }

  public subscribe(callback: CallbackType<T>) {
    const newId = this.idCounter++;
    const subscription = new Subscription(() => this.unsubscribe(newId));
    this.subscriptions.set(newId, callback);
    return subscription;
  }

  private unsubscribe(id: number) {
    const wasPresent = this._subscriptions.delete(id);
    if (!wasPresent) {
      // eslint-disable-next-line no-console
      console.warn('Event to unsubscribe was not found');
    }
  }
}
