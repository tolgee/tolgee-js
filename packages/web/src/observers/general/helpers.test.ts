import { closestElement, xPathEvaluate } from './helpers';

describe('helper functions', () => {
  it('closest parent on elements', () => {
    const div = document.createElement('div');
    expect(closestElement(div)).toEqual(div);

    expect(closestElement(document)).toEqual(document);
    expect(closestElement(document.documentElement)).toEqual(
      document.documentElement
    );

    expect(closestElement(document.body)).toEqual(document.body);
  });

  it('closest parent on attributes and text', () => {
    const div = document.createElement('div');
    div.textContent = 'test';
    div.setAttribute('aria-label', 'test');

    expect(closestElement(div.childNodes[0])).toEqual(div);
    expect(closestElement(div.getAttributeNode('aria-label')!)).toEqual(div);
  });

  it('evaluateXPath is not called on node but on parent', () => {
    const div = document.createElement('div');
    div.textContent = 'test';
    div.setAttribute('aria-label', 'test');

    const mock = jest
      .spyOn(document, 'evaluate')
      // @ts-ignore
      .mockImplementation((_: any, contextNode: Node) => {
        expect(contextNode).toEqual(div);
      });

    xPathEvaluate('', div);
    xPathEvaluate('', div.childNodes[0]);
    xPathEvaluate('', div.getAttributeNode('aria-label')!);

    expect(mock).toBeCalledTimes(3);
  });
});
