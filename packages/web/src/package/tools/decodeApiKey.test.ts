import { getProjectIdFromApiKey } from './decodeApiKey';

const PAK_KEY = 'tgpak_gfpxm4lin4zdazleoq4gm2rumfxgi2lfom2gw4dpguzxc';
const OLD_KEY = 'ryj4psai6vetel5b27ven6fajf';

describe('get projectId from api key', () => {
  it('can decode from pak key', () => {
    expect(getProjectIdFromApiKey(PAK_KEY)).toEqual(1);
  });

  it("won't fail on legacy code", () => {
    expect(getProjectIdFromApiKey(OLD_KEY)).toBeUndefined();
  });

  it('returns undefined for a tgpak whose body decodes to a non-numeric id', () => {
    // tgpak_mfrggzdf base32-decodes to "abcde" -> Number(...) is NaN
    expect(getProjectIdFromApiKey('tgpak_mfrggzdf')).toBeUndefined();
  });

  it('returns undefined for a tgpak with an empty body (Number("") would be 0)', () => {
    expect(getProjectIdFromApiKey('tgpak_')).toBeUndefined();
  });
});
