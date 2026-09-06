import { TolgeeCore } from '../TolgeeCore';

const transport = jest.fn();

describe('isDev', () => {
  it('is true with an api key and apiUrl', () => {
    expect(
      TolgeeCore().init({ apiKey: 'tgpak_x', apiUrl: 'http://x' }).isDev()
    ).toBe(true);
  });

  it('is true with an injected transport and apiUrl (no api key)', () => {
    const tolgee = TolgeeCore().init({ apiUrl: 'http://x' });
    tolgee.overrideCredentials({ apiUrl: 'http://x', transport, projectId: 1 });
    expect(tolgee.isDev()).toBe(true);
  });

  it('is false with no credential', () => {
    expect(TolgeeCore().init({ apiUrl: 'http://x' }).isDev()).toBe(false);
  });

  it('is false with a transport but no apiUrl', () => {
    const tolgee = TolgeeCore().init({ apiUrl: '' });
    tolgee.overrideCredentials({ apiUrl: '', transport, projectId: 1 });
    expect(tolgee.isDev()).toBe(false);
  });

  it('is false with an api key but no apiUrl', () => {
    expect(TolgeeCore().init({ apiKey: 'tgpak_x', apiUrl: '' }).isDev()).toBe(
      false
    );
  });
});
