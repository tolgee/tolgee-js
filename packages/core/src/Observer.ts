import { CoreHandler } from './handlers/CoreHandler';
import { Properties } from './Properties';
import { TextHandler } from './handlers/TextHandler';
import { AttributeHandler } from './handlers/AttributeHandler';
import { ElementRegistrar } from './services/ElementRegistrar';

export class Observer {
  constructor(
    private properties: Properties,
    private coreHandler: CoreHandler,
    private basicTextHandler: TextHandler,
    private attributeHandler: AttributeHandler,
    private nodeRegistrar: ElementRegistrar
  ) {}

  private _observer = undefined;

  private get observer(): MutationObserver | undefined {
    if (!this._observer && typeof window !== 'undefined') {
      this._observer = new MutationObserver(
        async (mutationsList: MutationRecord[]) => {
          for (const mutation of mutationsList) {
            if (mutation.type === 'characterData') {
              await this.basicTextHandler.handle(mutation.target as Element);
              continue;
            }
            if (mutation.type === 'childList') {
              await this.coreHandler.handleSubtree(mutation.target as Element);
              continue;
            }
            if (mutation.type === 'attributes') {
              await this.attributeHandler.handle(mutation.target as Element);
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
    this.observer.disconnect();
  }
}
