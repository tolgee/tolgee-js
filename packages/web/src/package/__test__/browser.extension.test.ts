const handshakerUpdate = jest.fn(() => Promise.resolve());
const Handshaker = jest.fn(() => ({ update: handshakerUpdate }));
const inContextToolsFactory = jest.fn(() => (tolgee: any) => tolgee);
const loadInContextLib = jest.fn(() => Promise.resolve(inContextToolsFactory));

jest.mock('../tools/extension', () => ({
  Handshaker,
}));

import {
  IN_CONTEXT_EXPORT_NAME,
  IN_CONTEXT_FILE,
  IN_CONTEXT_UMD_NAME,
} from '../BrowserExtensionPlugin/constants';

jest.mock('../BrowserExtensionPlugin/loadInContextLib', () => ({
  loadInContextLib,
}));

import { TolgeeCore } from '@tolgee/core';
import { BrowserExtensionPlugin } from '../typedIndex';
import { clearSessionStorage } from '../BrowserExtensionPlugin/BrowserExtensionPlugin';
import {
  API_KEY_SESSION_STORAGE,
  API_URL_SESSION_STORAGE,
  AUTH_TOKEN_SESSION_STORAGE,
  BRANCH_SESSION_STORAGE,
  PROJECT_ID_SESSION_STORAGE,
} from '../tools/sessionStorageKeys';
import { readFile } from 'fs/promises';
import { join } from 'path';

describe('compatibility with browser extension', () => {
  afterEach(() => {
    sessionStorage.clear();
    jest.clearAllMocks();
  });

  it('sends correct data to extension', async () => {
    const tolgee = TolgeeCore().init({ language: 'en', apiUrl: 'test' });
    tolgee.addPlugin(BrowserExtensionPlugin());
    await tolgee.run();
    expect(handshakerUpdate).toBeCalledTimes(1);
    expect(handshakerUpdate).toBeCalledWith({
      config: {
        apiKey: '',
        apiUrl: 'test',
        branch: undefined,
      },
      mode: 'production',
      uiPresent: true,
      uiVersion: undefined,
    });
  });

  it('forwards only the winning Bearer token when both apiKey and authToken are configured', async () => {
    const tolgee = TolgeeCore().init({
      language: 'en',
      apiUrl: 'test',
      apiKey: 'tgpak_x',
      authToken: 'jwt',
      projectId: 5,
    });
    tolgee.addPlugin(BrowserExtensionPlugin());
    await tolgee.run();
    expect(handshakerUpdate).toBeCalledWith(
      expect.objectContaining({
        config: expect.objectContaining({ apiKey: '', authToken: 'jwt' }),
      })
    );
  });

  it('forwards authToken and projectId to the extension handshake', async () => {
    const tolgee = TolgeeCore().init({
      language: 'en',
      apiUrl: 'test',
      authToken: 'jwt',
      projectId: 42,
    });
    tolgee.addPlugin(BrowserExtensionPlugin());
    await tolgee.run();
    expect(handshakerUpdate).toBeCalledWith(
      expect.objectContaining({
        config: expect.objectContaining({ authToken: 'jwt', projectId: 42 }),
      })
    );
  });

  it('sends branch from SDK config to extension', async () => {
    const tolgee = TolgeeCore().init({
      language: 'en',
      apiUrl: 'test',
      branch: 'my-branch',
    });
    tolgee.addPlugin(BrowserExtensionPlugin());
    await tolgee.run();
    expect(handshakerUpdate).toBeCalledTimes(1);
    expect(handshakerUpdate).toBeCalledWith(
      expect.objectContaining({
        config: expect.objectContaining({
          branch: 'my-branch',
        }),
      })
    );
  });

  it('loads in-context lib if session storage is set', async () => {
    sessionStorage.setItem(API_KEY_SESSION_STORAGE, 'test');
    sessionStorage.setItem(API_URL_SESSION_STORAGE, 'test');

    const tolgee = TolgeeCore().init({ language: 'en' });
    tolgee.addPlugin(BrowserExtensionPlugin());
    await tolgee.run();

    expect(loadInContextLib).toBeCalledTimes(1);
  });

  it('loads in-context lib with an OAuth token (no api key)', async () => {
    sessionStorage.setItem(API_URL_SESSION_STORAGE, 'test');
    sessionStorage.setItem(AUTH_TOKEN_SESSION_STORAGE, 'oauth-access-token');
    sessionStorage.setItem(PROJECT_ID_SESSION_STORAGE, '42');

    const tolgee = TolgeeCore().init({ language: 'en' });
    tolgee.addPlugin(BrowserExtensionPlugin());
    await tolgee.run();

    expect(loadInContextLib).toBeCalledTimes(1);
    const { credentials } = (inContextToolsFactory.mock.calls[0] as any)[0];
    expect(credentials.apiKey).toBeUndefined();
    expect(credentials.apiUrl).toEqual('test');
    expect(credentials.authToken).toEqual('oauth-access-token');
    expect(credentials.projectId).toEqual('42');
  });

  it('does not load in-context lib for an OAuth token without a projectId', async () => {
    sessionStorage.setItem(API_URL_SESSION_STORAGE, 'test');
    sessionStorage.setItem(AUTH_TOKEN_SESSION_STORAGE, 'oauth-access-token');

    const tolgee = TolgeeCore().init({ language: 'en' });
    tolgee.addPlugin(BrowserExtensionPlugin());
    await tolgee.run();

    expect(loadInContextLib).not.toBeCalled();
  });

  it('withholds a bare OAuth token (no projectId) when a PAK is also present', async () => {
    sessionStorage.setItem(API_URL_SESSION_STORAGE, 'test');
    sessionStorage.setItem(API_KEY_SESSION_STORAGE, 'tgpak_x');
    sessionStorage.setItem(AUTH_TOKEN_SESSION_STORAGE, 'bare-token');

    const tolgee = TolgeeCore().init({ language: 'en' });
    tolgee.addPlugin(BrowserExtensionPlugin());
    await tolgee.run();

    expect(loadInContextLib).toBeCalledTimes(1);
    const { credentials } = (inContextToolsFactory.mock.calls[0] as any)[0];
    expect(credentials.apiKey).toEqual('tgpak_x');
    expect(credentials.authToken).toBeUndefined();
  });

  it('does not load in-context lib when apiUrl is missing', async () => {
    sessionStorage.setItem(AUTH_TOKEN_SESSION_STORAGE, 'oauth-access-token');
    sessionStorage.setItem(PROJECT_ID_SESSION_STORAGE, '42');

    const tolgee = TolgeeCore().init({ language: 'en' });
    tolgee.addPlugin(BrowserExtensionPlugin());
    await tolgee.run();

    expect(loadInContextLib).not.toBeCalled();
  });

  it('forwards projectId injected into sessionStorage on the OAuth path', async () => {
    sessionStorage.setItem(API_URL_SESSION_STORAGE, 'test');
    sessionStorage.setItem(AUTH_TOKEN_SESSION_STORAGE, 'oauth-access-token');
    sessionStorage.setItem(PROJECT_ID_SESSION_STORAGE, '42');

    const tolgee = TolgeeCore().init({ language: 'en' });
    tolgee.addPlugin(BrowserExtensionPlugin());
    await tolgee.run();

    expect(loadInContextLib).toBeCalledTimes(1);
    expect(inContextToolsFactory).toBeCalledWith(
      expect.objectContaining({
        credentials: expect.objectContaining({
          authToken: 'oauth-access-token',
          projectId: '42',
        }),
      })
    );
  });

  it('picks up branch from sessionStorage', async () => {
    sessionStorage.setItem(API_KEY_SESSION_STORAGE, 'test');
    sessionStorage.setItem(API_URL_SESSION_STORAGE, 'test');
    sessionStorage.setItem(BRANCH_SESSION_STORAGE, 'my-branch');

    const tolgee = TolgeeCore().init({ language: 'en' });
    tolgee.addPlugin(BrowserExtensionPlugin());
    await tolgee.run();

    expect(loadInContextLib).toBeCalledTimes(1);
    expect(inContextToolsFactory).toBeCalledWith(
      expect.objectContaining({
        credentials: {
          apiKey: 'test',
          apiUrl: 'test',
          branch: 'my-branch',
        },
      })
    );
  });

  it('warns about a missing projectId in dev mode', () => {
    const warn = jest
      .spyOn(console, 'warn')
      .mockImplementation(() => undefined);
    const tolgee = TolgeeCore().init({
      language: 'en',
      apiKey: 'tgpat_x',
      apiUrl: 'http://x',
    });
    tolgee.addPlugin(BrowserExtensionPlugin());
    expect(warn).toHaveBeenCalledWith(expect.stringContaining('projectId'));
    warn.mockRestore();
  });

  it('does not warn on a working PAK page even if a stray OAuth token was injected', () => {
    // The tgpak embeds its project and the hijack guard keeps the stray injected token from taking over, so in-context
    // editing works via the PAK — the advisory must not fire on it.
    sessionStorage.setItem(AUTH_TOKEN_SESSION_STORAGE, 'injected-jwt');
    const warn = jest
      .spyOn(console, 'warn')
      .mockImplementation(() => undefined);
    const tolgee = TolgeeCore().init({
      language: 'en',
      apiKey: 'tgpak_gfpxm4lin4zdazleoq4gm2rumfxgi2lfom2gw4dpguzxc',
      apiUrl: 'http://x',
    });
    tolgee.addPlugin(BrowserExtensionPlugin());
    expect(warn).not.toHaveBeenCalled();
    warn.mockRestore();
  });

  it('warns for a token-configured SDK missing its projectId in dev mode', () => {
    const warn = jest
      .spyOn(console, 'warn')
      .mockImplementation(() => undefined);
    const tolgee = TolgeeCore().init({
      language: 'en',
      authToken: 'jwt',
      apiUrl: 'http://x',
    });
    tolgee.addPlugin(BrowserExtensionPlugin());
    expect(warn).toHaveBeenCalledWith(expect.stringContaining('projectId'));
    warn.mockRestore();
  });

  it('does not warn when a projectId is provided', () => {
    const warn = jest
      .spyOn(console, 'warn')
      .mockImplementation(() => undefined);
    const tolgee = TolgeeCore().init({
      language: 'en',
      apiKey: 'tgpat_x',
      apiUrl: 'http://x',
      projectId: 5,
    });
    tolgee.addPlugin(BrowserExtensionPlugin());
    expect(warn).not.toHaveBeenCalled();
    warn.mockRestore();
  });

  it('does not warn in production (no dev credentials)', () => {
    const warn = jest
      .spyOn(console, 'warn')
      .mockImplementation(() => undefined);
    const tolgee = TolgeeCore().init({ language: 'en' });
    tolgee.addPlugin(BrowserExtensionPlugin());
    expect(warn).not.toHaveBeenCalled();
    warn.mockRestore();
  });

  it('still warns when only an injected projectId is present (SDK config lacks its own)', () => {
    // The injected projectId is read by the in-context UMD, not by the SDK's own DevBackend/client requests, which
    // derive it from init options — so a token-configured SDK with no projectId of its own must still be warned.
    sessionStorage.setItem(PROJECT_ID_SESSION_STORAGE, '42');
    const warn = jest
      .spyOn(console, 'warn')
      .mockImplementation(() => undefined);
    const tolgee = TolgeeCore().init({
      language: 'en',
      authToken: 'jwt',
      apiUrl: 'http://x',
    });
    tolgee.addPlugin(BrowserExtensionPlugin());
    expect(warn).toHaveBeenCalledWith(expect.stringContaining('projectId'));
    warn.mockRestore();
  });

  it('does not warn when the projectId is embedded in a PAK api key', () => {
    const warn = jest
      .spyOn(console, 'warn')
      .mockImplementation(() => undefined);
    const tolgee = TolgeeCore().init({
      language: 'en',
      apiKey: 'tgpak_gfpxm4lin4zdazleoq4gm2rumfxgi2lfom2gw4dpguzxc',
      apiUrl: 'http://x',
    });
    tolgee.addPlugin(BrowserExtensionPlugin());
    expect(warn).not.toHaveBeenCalled();
    warn.mockRestore();
  });

  it('clearSessionStorage removes every injected key', () => {
    sessionStorage.setItem(API_KEY_SESSION_STORAGE, 'a');
    sessionStorage.setItem(API_URL_SESSION_STORAGE, 'b');
    sessionStorage.setItem(BRANCH_SESSION_STORAGE, 'c');
    sessionStorage.setItem(AUTH_TOKEN_SESSION_STORAGE, 'd');
    sessionStorage.setItem(PROJECT_ID_SESSION_STORAGE, 'e');
    clearSessionStorage();
    [
      API_KEY_SESSION_STORAGE,
      API_URL_SESSION_STORAGE,
      BRANCH_SESSION_STORAGE,
      AUTH_TOKEN_SESSION_STORAGE,
      PROJECT_ID_SESSION_STORAGE,
    ].forEach((key) => expect(sessionStorage.getItem(key)).toBeNull());
  });

  it('builded module is valid', async () => {
    // this test works only after build
    const fileContent = await readFile(
      join(__dirname, `../../../dist/${IN_CONTEXT_FILE}`)
    );
    expect(
      fileContent.toString().includes(`"${IN_CONTEXT_UMD_NAME}"`)
    ).toBeTruthy();
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const module = await import(`../../../dist/${IN_CONTEXT_FILE}`);
    expect(typeof module[IN_CONTEXT_EXPORT_NAME]).toEqual('function');
  });
});
