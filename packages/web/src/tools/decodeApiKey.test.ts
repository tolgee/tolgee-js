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
});
