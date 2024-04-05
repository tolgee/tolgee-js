import '@testing-library/jest-dom';
import { getRootElement } from '../getRootElement';
import { InContextUi } from '../InContextUi';
import { sleep } from '../tools/sleep';

function getShadowRootElement(testId: string, textContent: string) {
  const shadowRoot = getRootElement();

  return Array.from(
    shadowRoot.querySelectorAll(`*[data-testid="${testId}"]`)
  ).find((el) => el.textContent === textContent);
}

test('it selects the key', async () => {
  const ui = InContextUi({
    apiKey: 'test',
    apiUrl: 'test',
    projectId: undefined,
    highlight: () => ({ unhighlight: () => {} }),
    changeTranslation: () => ({ revert: () => {} }),
    findPositions: () => [],
    onPermanentChange: () => {},
  });

  const keys = new Map([
    ['key 1', 'Key 1'],
    ['key 2', 'Key 2'],
  ]);
  // open context menu and wait for select
  const resultPromise = ui.getKey({ target: document.body, keys: keys });

  await sleep(10);

  keys.forEach((translation, key) => {
    expect(
      getShadowRootElement('key_context_menu_translation', translation)
    ).toBeTruthy();
    expect(getShadowRootElement('key_context_menu_key', key)).toBeTruthy();
  });

  getShadowRootElement(
    'key_context_menu_translation',
    'Key 2'
  )!.parentElement!.click();

  const result = await resultPromise;
  expect(result).toEqual('key 2');
});
