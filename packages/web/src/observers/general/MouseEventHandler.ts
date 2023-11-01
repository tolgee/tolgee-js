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

const MODIFIER_MAP = new Map<
  ModifierKey,
  'ctrlKey' | 'altKey' | 'metaKey' | 'shiftKey'
>([
  ['Control', 'ctrlKey'],
  ['Alt', 'altKey'],
  ['Meta', 'metaKey'],
  ['Shift', 'shiftKey'],
]);

export function MouseEventHandler({
  highlightKeys,
  elementStore,
  onClick,
  options,
}: Props) {
  const keysDown = new Set<ModifierKey>();
  let highlighted: TolgeeElement | undefined;
  let cursorPosition: Coordinates | undefined;

  const documentOrShadowRoot = (options.targetElement?.getRootNode() ||
    document) as unknown as ShadowRoot;

  const targetDocument = options.targetElement?.ownerDocument || document;

  function highlight(el: TolgeeElement | undefined) {
    if (highlighted !== el) {
      unhighlight();
      const meta = elementStore.get(el);
      if (meta) {
        meta.preventClean = true;
        meta.highlight?.();
        highlighted = el;
      }
    }
  }

  function unhighlight() {
    const meta = elementStore.get(highlighted);
    if (meta) {
      meta.preventClean = false;
      meta.unhighlight?.();
      highlighted = undefined;
    }
  }

  function updateHighlight() {
    const position = cursorPosition;

    let newHighlighted: TolgeeElement | undefined;
    if (position && areKeysDown()) {
      const elements = documentOrShadowRoot.elementsFromPoint(
        position.x,
        position.y
      );

      newHighlighted = getClosestTolgeeElement(elements);
    }
    highlight(newHighlighted);
  }

  function updateCursorPosition(position: Coordinates) {
    cursorPosition = position;
    updateHighlight();
  }

  function updateModifiers(e: MouseEvent | KeyboardEvent) {
    for (const [modifier, modifierProperty] of MODIFIER_MAP.entries()) {
      if (keysDown.has(modifier) && !e[modifierProperty]) {
        keysDown.delete(modifier);
      } else if (!keysDown.has(modifier) && e[modifierProperty]) {
        keysDown.add(modifier);
      }
    }
  }

  function blockEvents(e: MouseEvent) {
    updateModifiers(e);
    if (areKeysDown() && !isInUiDialog(e.target as Element)) {
      e.stopPropagation();
      e.preventDefault();
    }
  }

  function onMouseMove(e: MouseEvent) {
    updateModifiers(e);
    updateCursorPosition({ x: e.clientX, y: e.clientY });
  }

  function onKeyDown(e: KeyboardEvent) {
    updateModifiers(e);
    updateHighlight();
  }

  function onKeyUp(e: KeyboardEvent) {
    updateModifiers(e);
    updateHighlight();
  }

  function onScroll() {
    const meta = elementStore.get(highlighted);
    meta?.highlight?.();
  }

  function handleClick(e: MouseEvent) {
    blockEvents(e);
    if (areKeysDown() && highlighted) {
      onClick(e, highlighted);
      unhighlight();
    }
  }

  function initEventListeners() {
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
    elements: Element[]
  ): TolgeeElement | undefined {
    for (const element of elements) {
      const result = findAncestor(element, (el) =>
        elementStore.get(el as TolgeeElement)
      ) as TolgeeElement | undefined | null;

      if (result !== undefined) {
        return result || undefined;
      }
    }
  }

  function findAncestor(
    element: Element,
    func: (el: Element) => any
  ): Element | undefined | null {
    if (element.id === DEVTOOLS_ID) {
      return null;
    }
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

  return Object.freeze({
    stop() {
      removeEventListeners();
    },

    run() {
      initEventListeners();
    },
  });
}
