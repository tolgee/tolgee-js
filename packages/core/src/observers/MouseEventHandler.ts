import { ElementMeta, ElementWithMeta, ModifierKey } from '../types';
import { DEVTOOLS_ID } from '../constants';

const eCapture = {
  capture: true,
};

const ePassive = {
  capture: true,
  passive: true,
};

type Coordinates = {
  x: number;
  y: number;
};

type TolgeeElement = Element &
  ElementCSSInlineStyle & { _tolgee?: ElementMeta };

type Props = {
  highlightKeys: ModifierKey[];
};

export const MouseEventHandler = ({ highlightKeys }: Props) => {
  let keysDown = new Set<ModifierKey>();
  let highlighted: ElementWithMeta | undefined;
  // let mouseOnChanged = new EventEmitterImpl<ElementWithMeta>();
  // let keysChanged: EventEmitterImpl<boolean> =
  //   new EventEmitterImpl<boolean>();
  let cursorPosition: Coordinates | undefined;

  function stop() {
    if (typeof window !== 'undefined') {
      removeEventListeners();
    }
  }

  const highlight = (el: ElementWithMeta | undefined) => {
    if (highlighted !== el) {
      unhighlight();
      if (el) {
        el._tolgee.preventClean = true;
        el._tolgee.highlight?.();
        highlighted = el;
        // mouseOnChanged.emit(el);
      }
    }
  };

  const unhighlight = () => {
    if (highlighted) {
      highlighted._tolgee.preventClean = false;
      highlighted._tolgee.unhighlight?.();
      highlighted = undefined;
      // mouseOnChanged.emit(highlighted);
    }
  };

  function updateHighlight() {
    const position = cursorPosition;

    let newHighlighted: ElementWithMeta | undefined;
    if (position && areKeysDown()) {
      const element = document.elementFromPoint(position.x, position.y);
      if (element) {
        newHighlighted = getClosestTolgeeElement(element);
      }
    }
    highlight(newHighlighted);
  }

  function updateCursorPosition(position: Coordinates) {
    cursorPosition = position;
    updateHighlight();
  }

  const blockEvents = (e: MouseEvent) => {
    if (areKeysDown() && !isInUiDialog(e.target as Element)) {
      e.stopPropagation();
      e.preventDefault();
    }
  };
  const onMouseMove = (e: MouseEvent) => {
    updateCursorPosition({ x: e.clientX, y: e.clientY });
  };
  const onBlur = () => {
    keysDown = new Set();
    // keysChanged.emit(areKeysDown());
    updateHighlight();
  };
  const onKeyDown = (e: KeyboardEvent) => {
    // @ts-ignore
    const modifierKey = ModifierKey[e.key];
    if (modifierKey !== undefined) {
      keysDown.add(modifierKey);
      // keysChanged.emit(areKeysDown());
    }
    updateHighlight();
  };
  const onKeyUp = (e: KeyboardEvent) => {
    // @ts-ignore
    keysDown.delete(ModifierKey[e.key]);
    // keysChanged.emit(areKeysDown());
    updateHighlight();
  };
  const onScroll = () => {
    highlighted?._tolgee.highlight?.();
  };
  const onClick = (e: MouseEvent) => {
    blockEvents(e);
    if (areKeysDown()) {
      const element = getClosestTolgeeElement(e.target as TolgeeElement);
      if (element && element === highlighted) {
        // dependencies.translationHighlighter.translationEdit(e, element);
        unhighlight();
      }
    }
  };

  function initEventListeners() {
    window.addEventListener('blur', onBlur, eCapture);
    window.addEventListener('keydown', onKeyDown, eCapture);
    window.addEventListener('keyup', onKeyUp, eCapture);
    window.addEventListener('mousemove', onMouseMove, ePassive);
    window.addEventListener('scroll', onScroll, ePassive);
    window.addEventListener('click', onClick, eCapture);

    window.addEventListener('mouseenter', blockEvents, eCapture);
    window.addEventListener('mouseover', blockEvents, eCapture);
    window.addEventListener('mouseout', blockEvents, eCapture);
    window.addEventListener('mouseleave', blockEvents, eCapture);
    window.addEventListener('mousedown', blockEvents, eCapture);
    window.addEventListener('mouseup', blockEvents, eCapture);
  }

  function removeEventListeners() {
    window.removeEventListener('blur', onBlur, eCapture);
    window.removeEventListener('keydown', onKeyDown, eCapture);
    window.removeEventListener('keyup', onKeyUp, eCapture);
    window.removeEventListener('mousemove', onMouseMove, ePassive);
    window.removeEventListener('scroll', onScroll, ePassive);
    window.removeEventListener('click', onClick, eCapture);

    window.removeEventListener('mouseenter', blockEvents, eCapture);
    window.removeEventListener('mouseover', blockEvents, eCapture);
    window.removeEventListener('mouseout', blockEvents, eCapture);
    window.removeEventListener('mouseleave', blockEvents, eCapture);
    window.removeEventListener('mousedown', blockEvents, eCapture);
    window.removeEventListener('mouseup', blockEvents, eCapture);
  }

  function isInUiDialog(element: Element) {
    return Boolean(findAncestor(element, (el) => el.id === DEVTOOLS_ID));
  }

  function getClosestTolgeeElement(
    element: Element
  ): ElementWithMeta | undefined {
    return findAncestor(
      element,
      (el) => (el as ElementWithMeta)?._tolgee
    ) as ElementWithMeta;
  }

  function findAncestor(
    element: Element,
    func: (el: Element) => any
  ): Element | undefined {
    if (func(element)) {
      return element;
    }
    if (element?.parentElement) {
      return findAncestor(element.parentElement, func);
    }
    return undefined;
  }

  function areKeysDown() {
    for (const key of highlightKeys) {
      if (!keysDown.has(key)) {
        return false;
      }
    }
    return true;
  }

  initEventListeners();

  return Object.freeze({
    stop,
  });
};
