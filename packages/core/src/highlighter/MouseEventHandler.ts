import { ElementMeta, ElementWithMeta } from '../types';
import { ModifierKey } from '../Constants/ModifierKey';
import { EventEmitterImpl } from '../services/EventEmitter';
import { DependencyService } from '../services/DependencyService';

const eCapture = {
  capture: true,
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
      this.initKeyListener();
      return;
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

  private initKeyListener() {
    const defaultEventBlock = (e: MouseEvent) => {
      if (this.areKeysDown()) {
        e.stopPropagation();
        e.preventDefault();
      }
    };
    document.addEventListener(
      'blur',
      () => {
        this.keysDown = new Set();
        this.keysChanged.emit(this.areKeysDown());
        this.updateHighlight();
      },
      eCapture
    );

    document.addEventListener(
      'keydown',
      (e) => {
        const modifierKey = ModifierKey[e.key];
        if (modifierKey !== undefined) {
          this.keysDown.add(modifierKey);
          this.keysChanged.emit(this.areKeysDown());
        }
        this.updateHighlight();
      },
      eCapture
    );
    document.addEventListener(
      'keyup',
      (e) => {
        this.keysDown.delete(ModifierKey[e.key]);
        this.keysChanged.emit(this.areKeysDown());
        this.updateHighlight();
      },
      eCapture
    );
    document.addEventListener(
      'mousemove',
      (e) => {
        this.updateCursorPosition({ x: e.clientX, y: e.clientY });
      },
      { passive: true, capture: true }
    );
    document.addEventListener('mouseenter', defaultEventBlock, eCapture);
    document.addEventListener('mouseover', defaultEventBlock, eCapture);
    document.addEventListener('mouseout', defaultEventBlock, eCapture);
    document.addEventListener('mouseleave', defaultEventBlock, eCapture);
    document.addEventListener('mousedown', defaultEventBlock, eCapture);
    document.addEventListener('mouseup', defaultEventBlock, eCapture);
    document.addEventListener(
      'scroll',
      () => {
        this.highlighted?._tolgee.highlight();
      },
      { capture: true, passive: true }
    );
    document.addEventListener(
      'click',
      (e) => {
        defaultEventBlock(e);
        if (this.areKeysDown()) {
          const element = this.getClosestTolgeeElement(
            e.target as TolgeeElement
          );
          if (element && element === this.highlighted) {
            this.dependencies.translationHighlighter.translationEdit(
              e,
              element
            );
            this.unhighlight();
          }
        }
      },
      eCapture
    );
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
