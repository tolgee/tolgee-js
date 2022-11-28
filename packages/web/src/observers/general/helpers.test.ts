import { closestElement } from './helpers';

describe('closest parent function', () => {
  it('returns itself for elements', () => {
    const div = document.createElement('div');
    expect(closestElement(div)).toEqual(div);

    expect(closestElement(document.body)).toEqual(document.body);
  });

  it('returns parent for text and attribute elements', () => {
    const div = document.createElement('div');
    div.textContent = 'test';
    div.setAttribute('aria-label', 'test');

    expect(closestElement(div.childNodes[0])).toEqual(div);
    expect(closestElement(div.getAttributeNode('aria-label')!)).toEqual(div);
  });
});
