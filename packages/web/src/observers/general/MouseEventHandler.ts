import { ModifierKey, ObserverOptionsInternal } from '@tolgee/core';
import { TolgeeElement } from '../../types';
import { DEVTOOLS_ID } from '../../constants';
import { ElementStoreType } from './ElementStore';

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

type Props = {
  highlightKeys: ModifierKey[];
  elementStore: ElementStoreType;
  onClick: (event: MouseEvent, el: TolgeeElement) => void;
  options: ObserverOptionsInternal;
};

export const MouseEventHandler = ({
  highlightKeys,
  elementStore,
  onClick,
  options,
}: Props) => {
  let keysDown = new Set<ModifierKey>();
  let highlighted: TolgeeElement | undefined;
  let cursorPosition: Coordinates | undefined;

  const documentOrShadowRoot = (options.targetElement?.getRootNode() ||
    document) as unknown as ShadowRoot;

  const targetDocument = options.targetElement?.ownerDocument || document;

  const highlight = (el: TolgeeElement | undefined) => {
    if (highlighted !== el) {
      unhighlight();
      const meta = elementStore.get(el);
      if (meta) {
        meta.preventClean = true;
        meta.highlight?.();
        highlighted = el;
      }
    }
  };

  const unhighlight = () => {
    const meta = elementStore.get(highlighted);
    if (meta) {
      meta.preventClean = false;
      meta.unhighlight?.();
      highlighted = undefined;
    }
  };

  function updateHighlight() {
    const position = cursorPosition;

    let newHighlighted: TolgeeElement | undefined;
    if (position && areKeysDown()) {
      const element = documentOrShadowRoot.elementFromPoint(
        position.x,
        position.y
      );
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
    const modifierKey = e.key as unknown as ModifierKey;
    if (modifierKey !== undefined) {
      keysDown.add(modifierKey);
      // keysChanged.emit(areKeysDown());
    }
    updateHighlight();
  };
  const onKeyUp = (e: KeyboardEvent) => {
    keysDown.delete(e.key as unknown as ModifierKey);
    // keysChanged.emit(areKeysDown());
    updateHighlight();
  };
  const onScroll = () => {
    const meta = elementStore.get(highlighted);
    meta?.highlight?.();
  };
  const handleClick = (e: MouseEvent) => {
    blockEvents(e);
    if (areKeysDown() && highlighted) {
      onClick(e, highlighted);
      unhighlight();
    }
  };

  function initEventListeners() {
    targetDocument.addEventListener('blur', onBlur, eCapture);
    targetDocument.addEventListener('keydown', onKeyDown, eCapture);
    targetDocument.addEventListener('keyup', onKeyUp, eCapture);
    targetDocument.addEventListener('mousemove', onMouseMove, ePassive);
    targetDocument.addEventListener('scroll', onScroll, ePassive);
    targetDocument.addEventListener('click', handleClick, eCapture);

    targetDocument.addEventListener('mouseenter', blockEvents, eCapture);
    targetDocument.addEventListener('mouseover', blockEvents, eCapture);
    targetDocument.addEventListener('mouseout', blockEvents, eCapture);
    targetDocument.addEventListener('mouseleave', blockEvents, eCapture);
    targetDocument.addEventListener('mousedown', blockEvents, eCapture);
    targetDocument.addEventListener('mouseup', blockEvents, eCapture);
  }

  function removeEventListeners() {
    targetDocument.removeEventListener('blur', onBlur, eCapture);
    targetDocument.removeEventListener('keydown', onKeyDown, eCapture);
    targetDocument.removeEventListener('keyup', onKeyUp, eCapture);
    targetDocument.removeEventListener('mousemove', onMouseMove, ePassive);

    targetDocument.removeEventListener('scroll', onScroll, ePassive);
    targetDocument.removeEventListener('click', handleClick, eCapture);

    targetDocument.removeEventListener('mouseenter', blockEvents, eCapture);
    targetDocument.removeEventListener('mouseover', blockEvents, eCapture);
    targetDocument.removeEventListener('mouseout', blockEvents, eCapture);
    targetDocument.removeEventListener('mouseleave', blockEvents, eCapture);
    targetDocument.removeEventListener('mousedown', blockEvents, eCapture);
    targetDocument.removeEventListener('mouseup', blockEvents, eCapture);
  }

  function isInUiDialog(element: Element) {
    return Boolean(findAncestor(element, (el) => el.id === DEVTOOLS_ID));
  }

  function getClosestTolgeeElement(
    element: Element
  ): TolgeeElement | undefined {
    return findAncestor(element, (el) =>
      elementStore.get(el as TolgeeElement)
    ) as TolgeeElement;
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

  function stop() {
    removeEventListeners();
  }

  function run() {
    initEventListeners();
  }

  return Object.freeze({
    run,
    stop,
  });
};
