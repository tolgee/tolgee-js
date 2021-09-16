import { Properties } from '../Properties';
import { ElementWithMeta } from '../types';

export class HighlightFunctionsInitializer {
  constructor(private properties: Properties) {}

  initFunctions(element: ElementWithMeta) {
    this.initHighlightFunction(element);
    this.initUnhighlightFunction(element);
  }

  private initHighlightFunction(element: ElementWithMeta) {
    element._tolgee.highlight = () => {
      element._tolgee.initialBackgroundColor = element.style.backgroundColor;
      element.style.backgroundColor = this.properties.config.highlightColor;
    };
  }

  private initUnhighlightFunction(element: ElementWithMeta) {
    element._tolgee.unhighlight = () => {
      element.style.backgroundColor = element._tolgee.initialBackgroundColor;
    };
  }
}
