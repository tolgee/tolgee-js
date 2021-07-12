import { Lifecycle, scoped } from 'tsyringe';
import { ElementWithMeta } from '../types';
import { Properties } from '../Properties';
import { TOLGEE_ATTRIBUTE_NAME } from '../Constants/Global';
import { TranslationHighlighter } from '../highlighter/TranslationHighlighter';
import { NodeHelper } from '../helpers/NodeHelper';

@scoped(Lifecycle.ContainerScoped)
export class ElementRegistrar {
  private registeredElements: Set<ElementWithMeta> = new Set();

  constructor(
    private properties: Properties,
    private translationHighlighter: TranslationHighlighter
  ) {}

  register(element: ElementWithMeta) {
    //ignore element with no active nodes
    if (this.getActiveNodes(element).next().value === undefined) {
      return;
    }
    if (
      this.properties.config.mode === 'development' &&
      !this.registeredElements.has(element)
    ) {
      this.translationHighlighter.listen(element);
    }
    this.registeredElements.add(element);
  }

  refreshAll() {
    for (const element of this.registeredElements) {
      this.cleanElementInactiveNodes(element);
      if (element._tolgee.nodes.size === 0) {
        this.cleanElement(element);
      }
    }
  }

  cleanAll() {
    for (const registeredElement of this.registeredElements) {
      this.cleanElement(registeredElement);
    }
  }

  private cleanElementInactiveNodes(element: ElementWithMeta) {
    if (this.isElementActive(element)) {
      element._tolgee.nodes = new Set(this.getActiveNodes(element));
      return;
    }
  }

  private cleanElement(element: ElementWithMeta) {
    if (typeof element._tolgee.removeAllEventListeners === 'function') {
      element._tolgee.removeAllEventListeners();
    }
    element.removeAttribute(TOLGEE_ATTRIBUTE_NAME);
    delete element._tolgee;
    this.registeredElements.delete(element);
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
