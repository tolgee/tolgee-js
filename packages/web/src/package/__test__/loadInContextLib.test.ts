jest.mock('../tools/isSSR', () => ({ isSSR: jest.fn(() => false) }));
import { isSSR } from '../tools/isSSR';
import {
  inContextLibSrc,
  isTrustedInContextUrl,
  trustedOverrideUrl,
} from '../BrowserExtensionPlugin/loadInContextLib';

const devPage = {
  origin: 'http://localhost:5173',
  hostname: 'localhost',
  href: 'http://localhost:5173/',
};
const prodPage = {
  origin: 'https://app.example.com',
  hostname: 'app.example.com',
  href: 'https://app.example.com/app',
};

describe('isTrustedInContextUrl', () => {
  it('honors a same-origin override on a dev page', () => {
    expect(isTrustedInContextUrl('/tolgee.umd.js', devPage)).toBe(true);
    expect(
      isTrustedInContextUrl('http://localhost:5173/tolgee.umd.js', devPage)
    ).toBe(true);
  });

  it('honors a localhost override on a dev page', () => {
    expect(isTrustedInContextUrl('http://localhost:9000/x.js', devPage)).toBe(
      true
    );
    expect(isTrustedInContextUrl('http://127.0.0.1:9000/x.js', devPage)).toBe(
      true
    );
  });

  it('treats an IPv6 loopback host as a dev page', () => {
    const v6Page = {
      origin: 'http://[::1]:5173',
      hostname: '[::1]',
      href: 'http://[::1]:5173/',
    };
    expect(isTrustedInContextUrl('/tolgee.umd.js', v6Page)).toBe(true);
    expect(isTrustedInContextUrl('http://[::1]:9000/x.js', v6Page)).toBe(true);
    expect(isTrustedInContextUrl('/x.js', { ...v6Page, hostname: '::1' })).toBe(
      true
    );
  });

  it('rejects a cross-origin override even on a dev page', () => {
    expect(
      isTrustedInContextUrl('https://evil.example.com/x.js', devPage)
    ).toBe(false);
  });

  it('rejects a protocol-relative override to another host', () => {
    expect(isTrustedInContextUrl('//evil.example.com/x.js', devPage)).toBe(
      false
    );
  });

  it('rejects a userinfo override that embeds a dev host before an evil host', () => {
    expect(
      isTrustedInContextUrl('https://localhost@evil.example.com/x.js', devPage)
    ).toBe(false);
  });

  it('rejects every override on a production page (including same-origin)', () => {
    expect(
      isTrustedInContextUrl('https://app.example.com/x.js', prodPage)
    ).toBe(false);
    expect(isTrustedInContextUrl('http://localhost:9000/x.js', prodPage)).toBe(
      false
    );
  });

  it('rejects a missing or malformed override', () => {
    expect(isTrustedInContextUrl(undefined, devPage)).toBe(false);
    expect(isTrustedInContextUrl('http://[malformed', devPage)).toBe(false);
  });
});

describe('trustedOverrideUrl', () => {
  // jsdom serves the tests from http://localhost, i.e. a dev origin.
  afterEach(() => {
    delete window.__TOLGEE_IN_CONTEXT_URL__;
  });

  it('returns a trusted same-origin override', () => {
    window.__TOLGEE_IN_CONTEXT_URL__ = '/tolgee.umd.js';
    expect(trustedOverrideUrl()).toEqual('/tolgee.umd.js');
  });

  it('discards a cross-origin override', () => {
    window.__TOLGEE_IN_CONTEXT_URL__ = 'https://evil.example.com/x.js';
    expect(trustedOverrideUrl()).toBeUndefined();
  });

  it('returns undefined when the global is unset', () => {
    expect(trustedOverrideUrl()).toBeUndefined();
  });

  it('returns undefined under SSR without touching window', () => {
    (isSSR as jest.Mock).mockReturnValueOnce(true);
    window.__TOLGEE_IN_CONTEXT_URL__ = '/tolgee.umd.js';
    expect(trustedOverrideUrl()).toBeUndefined();
  });
});

describe('inContextLibSrc', () => {
  afterEach(() => {
    delete window.__TOLGEE_IN_CONTEXT_URL__;
  });

  it('uses a trusted override as the script source', () => {
    window.__TOLGEE_IN_CONTEXT_URL__ = '/local.umd.js';
    expect(inContextLibSrc('1.2.3')).toEqual('/local.umd.js');
  });

  it('falls back to the CDN when there is no trusted override', () => {
    window.__TOLGEE_IN_CONTEXT_URL__ = 'https://evil.example.com/x.js';
    expect(inContextLibSrc('1.2.3')).toContain('cdn.jsdelivr.net');
    expect(inContextLibSrc('1.2.3')).toContain('@tolgee/web@1.2.3');
  });

  it('falls back to the CDN under SSR (ignoring any override)', () => {
    (isSSR as jest.Mock).mockReturnValueOnce(true);
    window.__TOLGEE_IN_CONTEXT_URL__ = '/local.umd.js';
    expect(inContextLibSrc('1.2.3')).toContain('cdn.jsdelivr.net');
  });
});
