jest.dontMock('./TolgeeConfig');

import { TolgeeConfig } from './TolgeeConfig';

describe('TolgeeConfig', () => {
  test('will be created with default targetElement', () => {
    const tolgeeConfig = new TolgeeConfig();
    expect(tolgeeConfig.targetElement).toEqual(document.body);
  });

  test('will be created with provided targetElement', () => {
    const div = document.createElement('div');
    const tolgeeConfig = new TolgeeConfig({ targetElement: div });
    expect(tolgeeConfig.targetElement).toEqual(div);
  });

  test('will be created with default when empty object', () => {
    const tolgeeConfig = new TolgeeConfig({});
    expect(tolgeeConfig.targetElement).toEqual(document.body);
  });
});
