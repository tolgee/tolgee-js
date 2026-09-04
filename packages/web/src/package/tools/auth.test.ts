import {
  bearerSdkHeaders,
  buildAuthHeader,
  resolveLiveCredential,
} from './auth';

// See decodeApiKey.test.ts for how a tgpak's embedded project id is decoded.
const PAK_FOR_PROJECT_1 = 'tgpak_gfpxm4lin4zdazleoq4gm2rumfxgi2lfom2gw4dpguzxc';

const transport = jest.fn();

describe('buildAuthHeader', () => {
  it('sends X-API-Key for an api key', () => {
    expect(buildAuthHeader('tgpak_x')).toEqual({ 'X-API-Key': 'tgpak_x' });
  });

  it('returns no header without an api key', () => {
    expect(buildAuthHeader(undefined)).toEqual({});
    expect(buildAuthHeader('')).toEqual({});
  });
});

describe('bearerSdkHeaders', () => {
  it('adds the SDK type/version headers for a request through the extension', () => {
    const headers = bearerSdkHeaders(true);
    expect(headers['x-tolgee-sdk-type']).toEqual('JS');
    expect(headers['x-tolgee-sdk-version']).toBeDefined();
  });

  it('adds nothing for an api-key credential (the fetch wrapper adds them there)', () => {
    expect(bearerSdkHeaders(false)).toEqual({});
  });
});

describe('resolveLiveCredential', () => {
  it('routes through the extension with no auth header and requires an explicit project', () => {
    expect(resolveLiveCredential({ transport, projectId: 7 })).toEqual({
      authHeader: {},
      viaExtension: true,
      hasCredential: true,
      projectId: 7,
      requiresExplicitProject: true,
    });
  });

  it('lets the transport win over an api key that is also present', () => {
    const resolved = resolveLiveCredential({
      apiKey: PAK_FOR_PROJECT_1,
      transport,
      projectId: 9,
    });
    expect(resolved.authHeader).toEqual({});
    expect(resolved.viaExtension).toBe(true);
    expect(resolved.projectId).toBe(9);
  });

  it('reports viaExtension as false for an api-key credential', () => {
    expect(resolveLiveCredential({ apiKey: 'tgpak_x' }).viaExtension).toBe(
      false
    );
  });

  it('requires an explicit project for a PAT (tgpat) key', () => {
    expect(
      resolveLiveCredential({ apiKey: 'tgpat_x' }).requiresExplicitProject
    ).toBe(true);
  });

  it('extracts the embedded project from a PAK and requires no explicit one', () => {
    const resolved = resolveLiveCredential({ apiKey: PAK_FOR_PROJECT_1 });
    expect(resolved.projectId).toBe(1);
    expect(resolved.requiresExplicitProject).toBe(false);
    expect(resolved.authHeader).toEqual({ 'X-API-Key': PAK_FOR_PROJECT_1 });
  });

  it('reports no credential and no header when neither is present', () => {
    const resolved = resolveLiveCredential({});
    expect(resolved.hasCredential).toBe(false);
    expect(resolved.authHeader).toEqual({});
    expect(resolved.requiresExplicitProject).toBe(false);
  });

  it('treats an empty apiKey as no credential', () => {
    const resolved = resolveLiveCredential({ apiKey: '' });
    expect(resolved.hasCredential).toBe(false);
    expect(resolved.authHeader).toEqual({});
  });

  it('falls back to the supplied projectId for a malformed PAK (no NaN scope)', () => {
    // See decodeApiKey.test.ts for why tgpak_mfrggzdf's embedded project is unresolved.
    const resolved = resolveLiveCredential({
      apiKey: 'tgpak_mfrggzdf',
      projectId: 5,
    });
    expect(resolved.projectId).toBe(5);
  });
});
