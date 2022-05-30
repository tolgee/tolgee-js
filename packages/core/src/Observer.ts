import { Properties } from './Properties';
import { ElementRegistrar } from './services/ElementRegistrar';
import { AbstractWrapper } from './wrappers/AbstractWrapper';

export class Observer {
  constructor(
    private properties: Properties,
    private textWrapper: AbstractWrapper,
    private nodeRegistrar: ElementRegistrar
  ) {}

  private _observer = undefined;
  private _observing = false;

  private get observer(): MutationObserver | undefined {
    if (!this._observer && typeof window !== 'undefined') {
      this._observer = new MutationObserver(
        async (mutationsList: MutationRecord[]) => {
          for (const mutation of mutationsList) {
            if (!this._observing) {
              // make sure we don't touch the DOM after disconnect is called
              return;
            }
            if (mutation.type === 'characterData') {
              await this.textWrapper.handleText(mutation.target as Element);
              continue;
            }
            if (mutation.type === 'childList') {
              await this.textWrapper.handleSubtree(mutation.target as Element);
              continue;
            }
            if (mutation.type === 'attributes') {
              await this.textWrapper.handleAttribute(
                mutation.target as Element
              );
            }
          }
          this.nodeRegistrar.refreshAll();
        }
      );
    }
    return this._observer;
  }

  public observe() {
    if (!this.observer) {
      return;
    }
    if (this._observing) {
      return;
    }
    this._observing = true;
    this.observer.observe(this.properties.config.targetElement, {
      attributes: true,
      childList: true,
      subtree: true,
      characterData: true,
    });
  }

  public stopObserving() {
    if (!this.observer) {
      return;
    }
    this._observing = false;
    this.observer.disconnect();
  }
}
