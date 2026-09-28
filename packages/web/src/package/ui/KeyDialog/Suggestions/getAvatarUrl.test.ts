import { getAvatarUrl } from './getAvatarUrl';

describe('getAvatarUrl', () => {
  it('resolves a relative thumbnail against the api url', () => {
    expect(getAvatarUrl('/uploaded-avatars/a.jpg', 'https://app.test/')).toBe(
      'https://app.test/uploaded-avatars/a.jpg'
    );
  });

  it('keeps an absolute thumbnail', () => {
    expect(getAvatarUrl('https://cdn.test/a.jpg', 'https://app.test')).toBe(
      'https://cdn.test/a.jpg'
    );
  });

  it('resolves against the page origin when the api url is relative', () => {
    expect(getAvatarUrl('/uploaded-avatars/a.jpg', '/api')).toBe(
      `${window.location.origin}/uploaded-avatars/a.jpg`
    );
  });

  it('gives up instead of throwing', () => {
    expect(getAvatarUrl(undefined, 'https://app.test')).toBeUndefined();
    expect(getAvatarUrl('http://[', 'https://app.test')).toBeUndefined();
  });
});
