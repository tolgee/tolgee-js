import { ElementWithMeta } from '../types';
import { TOLGEE_HIGHLIGHTER_CLASS } from '../constants';

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

type Props = {
  highlightColor: string;
  highlightWidth: number;
};

export const ElementHighlighter = ({
  highlightColor,
  highlightWidth,
}: Props) => {
  function initHighlightFunction(element: ElementWithMeta) {
    element._tolgee.highlight = () => {
      if (!element.isConnected) {
        return;
      }
      let highlightEl = element._tolgee.highlightEl;
      if (!highlightEl) {
        highlightEl = document.createElement('div');
        highlightEl.classList.add(TOLGEE_HIGHLIGHTER_CLASS);
        Object.entries(HIGHLIGHTER_BASE_STYLE).forEach(([key, value]) => {
          // @ts-ignore
          highlightEl!.style[key] = value;
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

  function initUnhighlightFunction(element: ElementWithMeta) {
    element._tolgee.unhighlight = () => {
      element._tolgee.highlightEl?.remove();
      element._tolgee.highlightEl = undefined;
    };
  }

  function initHighlighter(element: ElementWithMeta) {
    initHighlightFunction(element);
    initUnhighlightFunction(element);
  }

  return Object.freeze({ initHighlighter });
};
