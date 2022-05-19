import { TOLGEE_HIGHLIGHTER_CLASS } from '../Constants/Global';
import { Properties } from '../Properties';
import { ElementWithMeta } from '../types';

const HIGHLIGHTER_BASE_STYLE: Partial<CSSStyleDeclaration> = {
  pointerEvents: 'none',
  position: 'fixed',
  boxSizing: 'content-box',
  zIndex: String(Number.MAX_SAFE_INTEGER),
  contain: 'layout',
  display: 'block',
  borderStyle: 'solid',
  borderRadius: '4px',
};

export class HighlightFunctionsInitializer {
  constructor(private properties: Properties) {}

  initFunctions(element: ElementWithMeta) {
    this.initHighlightFunction(element);
    this.initUnhighlightFunction(element);
  }

  borderElement: HTMLDivElement | null;
  private initHighlightFunction(element: ElementWithMeta) {
    element._tolgee.highlight = () => {
      const highlightColor = this.properties.config.highlightColor;
      const highlightWidth = this.properties.config.highlightWidth;
      if (!element.isConnected) {
        return;
      }
      let highlightEl = element._tolgee.highlightEl;
      if (!highlightEl) {
        highlightEl = document.createElement('div');
        highlightEl.classList.add(TOLGEE_HIGHLIGHTER_CLASS);
        Object.entries(HIGHLIGHTER_BASE_STYLE).forEach(([key, value]) => {
          highlightEl.style[key] = value;
        });
        highlightEl.style.borderColor = highlightColor;

        element._tolgee.highlightEl = highlightEl;
        document.body.appendChild(highlightEl);
      }

      const shape = element.getBoundingClientRect();

      highlightEl.style.borderWidth = highlightWidth + 'px';
      highlightEl.style.top = shape.top - highlightWidth + 'px';
      highlightEl.style.left = shape.left - highlightWidth + 'px';
      highlightEl.style.width = shape.width + 'px';
      highlightEl.style.height = shape.height + 'px';
    };
  }

  private initUnhighlightFunction(element: ElementWithMeta) {
    element._tolgee.unhighlight = () => {
      element._tolgee.highlightEl?.remove();
      element._tolgee.highlightEl = null;
    };
  }
}
