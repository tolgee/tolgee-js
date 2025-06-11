import { createUrl, joinUrls } from './url';

describe('url module', () => {
  it('joins urls without double slash', () => {
    expect(joinUrls('a/b/', '/c')).toEqual('a/b/c');
  });

  it("doesn't remove last slash", () => {
    expect(joinUrls('a/b/', '/c/')).toEqual('a/b/c/');
  });

  it("doesn't touch the protocol", () => {
    expect(joinUrls('https://test.com/', '/c/')).toEqual('https://test.com/c/');
  });

  it("won't fail when origin invalid", () => {
    jest.spyOn(window, 'location', 'get').mockReturnValue({
      ...window.location,
      origin: 'null',
    });

    expect(createUrl('https://test.com/', '/c/').toString()).toEqual(
      'https://test.com/c/'
    );
  });
});
