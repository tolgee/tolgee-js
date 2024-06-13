import { checkPlatformVersion } from './checkPlatformVersion';

describe('checks platform version correctly', () => {
  it('returns error if version is lower', () => {
    expect(checkPlatformVersion('v1.2.3', 'v1.2.2')).toBeInstanceOf(Error);
    expect(checkPlatformVersion('v1.2.3', 'v1.2.1')).toBeInstanceOf(Error);
    expect(checkPlatformVersion('v1.2.3', 'v1.1.4')).toBeInstanceOf(Error);
    expect(checkPlatformVersion('v1.2.3', 'v0.0.0')).toBeInstanceOf(Error);
  });

  it('returns undefined if version is higher', () => {
    expect(checkPlatformVersion('v1.2.3', 'v1.2.3')).toBeUndefined();
    expect(checkPlatformVersion('v1.2.3', 'v1.2.4')).toBeUndefined();
    expect(checkPlatformVersion('v1.2.3', 'v1.4.2')).toBeUndefined();
    expect(checkPlatformVersion('v1.2.3', 'v2.0.0')).toBeUndefined();
  });

  it('returns undefined if version is invalid', () => {
    expect(checkPlatformVersion('v1.2.3', 'local')).toBeUndefined();
    expect(checkPlatformVersion('v1.2.3', '??')).toBeUndefined();
    expect(checkPlatformVersion('v1.2.3', 'invalid')).toBeUndefined();
    expect(checkPlatformVersion('v1.2.3', undefined)).toBeUndefined();
  });
});
