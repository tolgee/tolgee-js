import { Properties } from '../Properties';
import { ElementWithMeta } from '../types';

const BORDER_WIDTH = 5;

export class HighlightFunctionsInitializer {
  constructor(private properties: Properties) {}

  initFunctions(element: ElementWithMeta) {
    this.initHighlightFunction(element);
    this.initUnhighlightFunction(element);
  }

  borderElement: HTMLDivElement | null;
  private initHighlightFunction(element: ElementWithMeta) {
    element._tolgee.highlight = () => {
      if (!element.isConnected) {
        return;
      }
      let highlightEl = element._tolgee.highlightEl;
      if (!highlightEl) {
        highlightEl = document.createElement('div');
        highlightEl.style.pointerEvents = 'none';
        highlightEl.style.border = `${BORDER_WIDTH}px solid ${this.properties.config.highlightColor}`;
        highlightEl.style.position = 'fixed';
        highlightEl.style.boxSizing = 'border-box';
        highlightEl.style.zIndex = String(Number.MAX_SAFE_INTEGER);
        highlightEl.style.contain = 'layout';

        element._tolgee.highlightEl = highlightEl;
        document.body.appendChild(highlightEl);
      }

      const shape = element.getBoundingClientRect();

      highlightEl.style.top = shape.top - BORDER_WIDTH + 'px';
      highlightEl.style.left = shape.left - BORDER_WIDTH + 'px';
      highlightEl.style.width = shape.width + 2 * BORDER_WIDTH + 'px';
      highlightEl.style.height = shape.height + 2 * BORDER_WIDTH + 'px';
      highlightEl.style.display = 'block';
    };
  }

  private initUnhighlightFunction(element: ElementWithMeta) {
    element._tolgee.unhighlight = () => {
      element._tolgee.highlightEl?.remove();
      element._tolgee.highlightEl = null;
    };
  }
}
