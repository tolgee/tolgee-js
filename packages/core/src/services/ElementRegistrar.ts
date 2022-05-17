import { ElementWithMeta } from '../types';
import { Properties } from '../Properties';
import { TOLGEE_ATTRIBUTE_NAME } from '../Constants/Global';
import { TranslationHighlighter } from '../highlighter/TranslationHighlighter';
import { NodeHelper } from '../helpers/NodeHelper';
import { EventService } from './EventService';
import { EventEmitterImpl } from './EventEmitter';

export class ElementRegistrar {
  private registeredElements: Set<ElementWithMeta> = new Set();

  constructor(
    private properties: Properties,
    private translationHighlighter: TranslationHighlighter,
    private eventService: EventService
  ) {}

  register(element: ElementWithMeta) {
    //ignore element with no active nodes
    if (
      this.getActiveNodes(element).next().value === undefined &&
      !element._tolgee.wrappedWithElementOnlyKey
    ) {
      return;
    }
    if (
      this.properties.mode === 'development' &&
      !this.registeredElements.has(element)
    ) {
      this.translationHighlighter.listen(element);
    }
    this.registeredElements.add(element);
    (
      this.eventService.ELEMENT_REGISTERED as EventEmitterImpl<ElementWithMeta>
    ).emit(element);
  }

  refreshAll() {
    for (const element of this.registeredElements) {
      if (!element._tolgee.preventClean) {
        this.cleanElementInactiveNodes(element);
        if (
          element._tolgee.nodes.size === 0 &&
          !element._tolgee.wrappedWithElementOnlyKey
        ) {
          this.cleanElement(element);
        }
      }
    }
  }

  cleanAll() {
    for (const registeredElement of this.registeredElements) {
      this.cleanElement(registeredElement);
    }
  }

  findAllByKey(key: string) {
    const result: ElementWithMeta[] = [];
    for (const registeredElement of this.registeredElements) {
      if (registeredElement._tolgee.wrappedWithElementOnlyKey === key) {
        result.push(registeredElement);
        continue;
      }
      for (const node of registeredElement._tolgee.nodes) {
        if (
          node._tolgee.keys.findIndex(
            (keyWithParams) => keyWithParams.key === key
          ) > -1
        ) {
          result.push(registeredElement);
          break;
        }
      }
    }
    return result;
  }

  private cleanElementInactiveNodes(element: ElementWithMeta) {
    if (this.isElementActive(element)) {
      element._tolgee.nodes = new Set(this.getActiveNodes(element));
      return;
    }
  }

  private cleanElement(element: ElementWithMeta) {
    if (!element._tolgee.preventClean) {
      if (element._tolgee.highlightEl) {
        element._tolgee.unhighlight();
      }
      element.removeAttribute(TOLGEE_ATTRIBUTE_NAME);
      delete element._tolgee;
      this.registeredElements.delete(element);
    }
  }

  private *getActiveNodes(element: ElementWithMeta) {
    for (const node of element._tolgee.nodes) {
      if (NodeHelper.nodeContains(this.properties.config.targetElement, node)) {
        yield node;
      }
    }
  }

  private isElementActive(element: ElementWithMeta) {
    return this.properties.config.targetElement.contains(element);
  }
}
