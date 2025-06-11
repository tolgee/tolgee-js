import { createUrl, joinUrls } from './url';

describe('url module', () => {
  it('joins urls without double slash', () => {
    expect(joinUrls('a/b/', '/c')).toEqual('a/b/c');
  });

  it("doesn't remove last slash", () => {
    expect(joinUrls('a/b/', '/c/')).toEqual('a/b/c/');
  });

  it("won't fail when origin invalid", () => {
    expect(joinUrls('https://test.com/', '/c/')).toEqual('https://test.com/c/');

    // @ts-ignore
    window.location = { ...window.location, origin: 'null' };
    expect(createUrl('https://test.com/', '/c/').toString()).toEqual(
      'https://test.com/c/'
    );
  });
});
