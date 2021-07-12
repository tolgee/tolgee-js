export class Subscription {
  constructor(private onUnsubscribe: () => void) {}

  unsubscribe() {
    this.onUnsubscribe();
  }
}
