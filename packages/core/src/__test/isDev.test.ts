import { TolgeeCore } from '../TolgeeCore';

describe('isDev', () => {
  it('is true with an api key and apiUrl', () => {
    expect(
      TolgeeCore().init({ apiKey: 'tgpak_x', apiUrl: 'http://x' }).isDev()
    ).toBe(true);
  });

  it('is true with an OAuth token and apiUrl (no api key)', () => {
    expect(
      TolgeeCore().init({ authToken: 'jwt', apiUrl: 'http://x' }).isDev()
    ).toBe(true);
  });

  it('is false with no credential', () => {
    expect(TolgeeCore().init({ apiUrl: 'http://x' }).isDev()).toBe(false);
  });
});
