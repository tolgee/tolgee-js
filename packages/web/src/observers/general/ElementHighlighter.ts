import { TOLGEE_HIGHLIGHTER_CLASS } from '../../constants';
import { ElementMeta, TolgeeElement } from '../../types';

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
  function initHighlightFunction(
    element: TolgeeElement,
    elementMeta: ElementMeta
  ) {
    elementMeta.highlight = () => {
      if (!element.isConnected) {
        return;
      }
      let highlightEl = elementMeta.highlightEl;
      if (!highlightEl) {
        highlightEl = document.createElement('div');
        highlightEl.classList.add(TOLGEE_HIGHLIGHTER_CLASS);
        Object.entries(HIGHLIGHTER_BASE_STYLE).forEach(([key, value]) => {
          // @ts-ignore
          highlightEl!.style[key] = value;
        });
        highlightEl.style.borderColor = highlightColor;

        elementMeta.highlightEl = highlightEl;
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

  function initUnhighlightFunction(
    element: TolgeeElement,
    elementMeta: ElementMeta
  ) {
    elementMeta.unhighlight = () => {
      elementMeta.highlightEl?.remove();
      elementMeta.highlightEl = undefined;
    };
  }

  function initHighlighter(element: TolgeeElement, elementMeta: ElementMeta) {
    initHighlightFunction(element, elementMeta);
    initUnhighlightFunction(element, elementMeta);
  }

  return Object.freeze({ initHighlighter });
};
