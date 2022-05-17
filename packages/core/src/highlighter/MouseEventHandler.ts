import { ElementMeta, ElementWithMeta } from '../types';
import { ModifierKey } from '../Constants/ModifierKey';
import { EventEmitterImpl } from '../services/EventEmitter';
import { DependencyService } from '../services/DependencyService';

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

export class MouseEventHandler {
  private keysDown = new Set<ModifierKey>();
  private highlighted: ElementWithMeta;
  private mouseOnChanged = new EventEmitterImpl<ElementWithMeta>();
  private keysChanged: EventEmitterImpl<boolean> =
    new EventEmitterImpl<boolean>();
  private cursorPosition: Coordinates | undefined;

  constructor(private dependencies: DependencyService) {}

  run() {
    if (typeof window !== 'undefined') {
      this.initEventListeners();
    }
  }

  stop() {
    if (typeof window !== 'undefined') {
      this.removeEventListeners();
    }
  }

  private readonly highlight = (el: ElementWithMeta | undefined) => {
    if (this.highlighted !== el) {
      this.unhighlight();
      if (el) {
        el._tolgee.preventClean = true;
        el._tolgee.highlight();
        this.highlighted = el;
        this.mouseOnChanged.emit(el);
      }
    }
  };

  private readonly unhighlight = () => {
    if (this.highlighted) {
      this.highlighted._tolgee.preventClean = false;
      this.highlighted._tolgee.unhighlight();
      this.highlighted = undefined;
      this.mouseOnChanged.emit(this.highlighted);
    }
  };

  private updateHighlight() {
    const position = this.cursorPosition;

    let newHighlighted: ElementWithMeta;
    if (position && this.areKeysDown()) {
      newHighlighted = this.getClosestTolgeeElement(
        document.elementFromPoint(position.x, position.y)
      );
    }
    this.highlight(newHighlighted);
  }

  private updateCursorPosition(position: Coordinates) {
    this.cursorPosition = position;
    this.updateHighlight();
  }

  private blockEvents = (e: MouseEvent) => {
    if (this.areKeysDown()) {
      e.stopPropagation();
      e.preventDefault();
    }
  };
  private onMouseMove = (e: MouseEvent) => {
    this.updateCursorPosition({ x: e.clientX, y: e.clientY });
  };
  private onBlur = () => {
    this.keysDown = new Set();
    this.keysChanged.emit(this.areKeysDown());
    this.updateHighlight();
  };
  private onKeyDown = (e: KeyboardEvent) => {
    const modifierKey = ModifierKey[e.key];
    if (modifierKey !== undefined) {
      this.keysDown.add(modifierKey);
      this.keysChanged.emit(this.areKeysDown());
    }
    this.updateHighlight();
  };
  private onKeyUp = (e: KeyboardEvent) => {
    this.keysDown.delete(ModifierKey[e.key]);
    this.keysChanged.emit(this.areKeysDown());
    this.updateHighlight();
  };
  private onScroll = () => {
    this.highlighted?._tolgee.highlight();
  };
  private onClick = (e: MouseEvent) => {
    this.blockEvents(e);
    if (this.areKeysDown()) {
      const element = this.getClosestTolgeeElement(e.target as TolgeeElement);
      if (element && element === this.highlighted) {
        this.dependencies.translationHighlighter.translationEdit(e, element);
        this.unhighlight();
      }
    }
  };

  private initEventListeners() {
    window.addEventListener('blur', this.onBlur, eCapture);
    window.addEventListener('keydown', this.onKeyDown, eCapture);
    window.addEventListener('keyup', this.onKeyUp, eCapture);
    window.addEventListener('mousemove', this.onMouseMove, ePassive);
    window.addEventListener('scroll', this.onScroll, ePassive);
    window.addEventListener('click', this.onClick, eCapture);

    window.addEventListener('mouseenter', this.blockEvents, eCapture);
    window.addEventListener('mouseover', this.blockEvents, eCapture);
    window.addEventListener('mouseout', this.blockEvents, eCapture);
    window.addEventListener('mouseleave', this.blockEvents, eCapture);
    window.addEventListener('mousedown', this.blockEvents, eCapture);
    window.addEventListener('mouseup', this.blockEvents, eCapture);
  }

  private removeEventListeners() {
    window.removeEventListener('blur', this.onBlur, eCapture);
    window.removeEventListener('keydown', this.onKeyDown, eCapture);
    window.removeEventListener('keyup', this.onKeyUp, eCapture);
    window.removeEventListener('mousemove', this.onMouseMove, ePassive);
    window.removeEventListener('scroll', this.onScroll, ePassive);
    window.removeEventListener('click', this.onClick, eCapture);

    window.removeEventListener('mouseenter', this.blockEvents, eCapture);
    window.removeEventListener('mouseover', this.blockEvents, eCapture);
    window.removeEventListener('mouseout', this.blockEvents, eCapture);
    window.removeEventListener('mouseleave', this.blockEvents, eCapture);
    window.removeEventListener('mousedown', this.blockEvents, eCapture);
    window.removeEventListener('mouseup', this.blockEvents, eCapture);
  }

  private getClosestTolgeeElement(
    element: Element
  ): ElementWithMeta | undefined {
    if ((element as ElementWithMeta)?._tolgee) {
      return element as ElementWithMeta;
    }
    if (element?.parentElement) {
      return this.getClosestTolgeeElement(element.parentElement);
    }
    return undefined;
  }

  private areKeysDown() {
    for (const key of this.dependencies.properties.config.highlightKeys) {
      if (!this.keysDown.has(key)) {
        return false;
      }
    }
    return true;
  }
}
