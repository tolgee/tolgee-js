import {
  buildAuthHeader,
  resolveCredential,
  resolveLiveAuthToken,
} from '../tools/auth';
import { AUTH_TOKEN_SESSION_STORAGE } from '../tools/sessionStorageKeys';

// A real tgpak whose base32 body decodes to project id 1 (see decodeApiKey.test.ts).
const PAK_FOR_PROJECT_1 = 'tgpak_gfpxm4lin4zdazleoq4gm2rumfxgi2lfom2gw4dpguzxc';

describe('resolveLiveAuthToken', () => {
  afterEach(() => {
    sessionStorage.clear();
    jest.restoreAllMocks();
  });

  it('prefers the live sessionStorage token over the init token (rotation)', () => {
    sessionStorage.setItem(AUTH_TOKEN_SESSION_STORAGE, 'rotated');
    expect(resolveLiveAuthToken('init-token', undefined)).toBe('rotated');
  });

  it('falls back to the init token when sessionStorage has none', () => {
    expect(resolveLiveAuthToken('init-token', undefined)).toBe('init-token');
  });

  it('reads sessionStorage on a fresh page when no init token was supplied', () => {
    sessionStorage.setItem(AUTH_TOKEN_SESSION_STORAGE, 'injected');
    expect(resolveLiveAuthToken(undefined, undefined)).toBe('injected');
  });

  it('never overrides a configured api key with a stray sessionStorage token', () => {
    sessionStorage.setItem(AUTH_TOKEN_SESSION_STORAGE, 'stray');
    // apiKey configured, no init token → stays on the api-key path
    expect(resolveLiveAuthToken(undefined, 'tgpak_x')).toBeUndefined();
  });

  it('returns the fallback when sessionStorage access throws (SSR/sandboxed iframe)', () => {
    jest.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('blocked');
    });
    expect(resolveLiveAuthToken('init-token', undefined)).toBe('init-token');
  });
});

describe('buildAuthHeader', () => {
  it('sends a Bearer header when a token is present', () => {
    expect(buildAuthHeader('jwt', undefined)).toEqual({
      Authorization: 'Bearer jwt',
    });
  });

  it('sends X-API-Key when only an api key is present', () => {
    expect(buildAuthHeader(undefined, 'tgpak_x')).toEqual({
      'X-API-Key': 'tgpak_x',
    });
  });

  it('prefers the token over the api key when both are present', () => {
    expect(buildAuthHeader('jwt', 'tgpak_x')).toEqual({
      Authorization: 'Bearer jwt',
    });
  });

  it('returns no header when neither a token nor an api key is present', () => {
    expect(buildAuthHeader(undefined, undefined)).toEqual({});
  });
});

describe('resolveCredential', () => {
  afterEach(() => sessionStorage.clear());

  it('sends a Bearer header and requires an explicit project for an OAuth token', () => {
    expect(resolveCredential({ authToken: 'jwt', projectId: 7 })).toEqual({
      authHeader: { Authorization: 'Bearer jwt' },
      hasCredential: true,
      projectId: 7,
      requiresExplicitProject: true,
    });
  });

  it('requires an explicit project for a PAT (tgpat) key', () => {
    expect(
      resolveCredential({ apiKey: 'tgpat_x' }).requiresExplicitProject
    ).toBe(true);
  });

  it('extracts the embedded project from a PAK and requires no explicit one', () => {
    const resolved = resolveCredential({ apiKey: PAK_FOR_PROJECT_1 });
    expect(resolved.projectId).toBe(1);
    expect(resolved.requiresExplicitProject).toBe(false);
    expect(resolved.authHeader).toEqual({ 'X-API-Key': PAK_FOR_PROJECT_1 });
  });

  it('scopes to the supplied projectId (not the PAK) when a token is also present', () => {
    // Incoherent config, but the active credential is the token, so its request must not scope to the PAK's project.
    const resolved = resolveCredential({
      apiKey: PAK_FOR_PROJECT_1,
      authToken: 'jwt',
      projectId: 9,
    });
    expect(resolved.authHeader).toEqual({ Authorization: 'Bearer jwt' });
    expect(resolved.projectId).toBe(9);
  });

  it('reports no credential and no header when neither is present', () => {
    const resolved = resolveCredential({});
    expect(resolved.hasCredential).toBe(false);
    expect(resolved.authHeader).toEqual({});
  });

  it('treats an empty authToken as no credential (no unauthenticated request)', () => {
    const resolved = resolveCredential({ authToken: '' });
    expect(resolved.hasCredential).toBe(false);
    expect(resolved.authHeader).toEqual({});
    expect(resolved.requiresExplicitProject).toBe(false);
  });

  it('treats an empty apiKey as no credential', () => {
    const resolved = resolveCredential({ apiKey: '' });
    expect(resolved.hasCredential).toBe(false);
    expect(resolved.authHeader).toEqual({});
  });

  it('falls back to the supplied projectId for a malformed PAK (no NaN scope)', () => {
    // tgpak_mfrggzdf decodes to a non-numeric id, so the embedded project is unresolved.
    const resolved = resolveCredential({
      apiKey: 'tgpak_mfrggzdf',
      projectId: 5,
    });
    expect(resolved.projectId).toBe(5);
  });

  it('prefers a live sessionStorage token for the header and project requirement', () => {
    sessionStorage.setItem(AUTH_TOKEN_SESSION_STORAGE, 'rotated');
    const resolved = resolveCredential({ authToken: 'init', projectId: 3 });
    expect(resolved.authHeader).toEqual({ Authorization: 'Bearer rotated' });
    expect(resolved.requiresExplicitProject).toBe(true);
  });
});
