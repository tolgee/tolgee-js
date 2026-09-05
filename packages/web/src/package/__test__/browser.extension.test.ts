const handshakerUpdate = jest.fn(() => Promise.resolve());
const Handshaker = jest.fn(() => ({ update: handshakerUpdate }));
const inContextToolsFactory = jest.fn(() => (tolgee: any) => tolgee);
const loadInContextLib = jest.fn(() => Promise.resolve(inContextToolsFactory));

jest.mock('../tools/extension', () => ({
  ...jest.requireActual('../tools/extension'),
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
  BRANCH_SESSION_STORAGE,
  EXTENSION_SESSION_STORAGE,
  PROJECT_ID_SESSION_STORAGE,
} from '../tools/sessionStorageKeys';
import { readFile } from 'fs/promises';
import { join } from 'path';

const credentialsPassedToInContextTools = () =>
  (inContextToolsFactory.mock.calls[0] as any)[0].credentials;

describe('compatibility with browser extension', () => {
  afterEach(() => {
    sessionStorage.clear();
    jest.clearAllMocks();
  });

  it('sends correct data to extension, naming the protocol it speaks', async () => {
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
      protocolVersion: 2,
    });
  });

  it('blanks the api key once a transport is injected (the page then holds no credential to forward)', async () => {
    const tolgee = TolgeeCore().init({
      language: 'en',
      apiUrl: 'test',
      apiKey: 'tgpak_x',
      projectId: 5,
    });
    tolgee.addPlugin(BrowserExtensionPlugin());
    tolgee.overrideCredentials({
      apiUrl: 'test',
      transport: jest.fn(),
      projectId: 5,
    });
    await tolgee.run();
    const last = handshakerUpdate.mock.calls.at(-1) as unknown as [
      { config: Record<string, unknown> },
    ];
    expect(last[0].config).toEqual(
      expect.objectContaining({ apiKey: '', projectId: 5 })
    );
    expect(last[0].config).not.toHaveProperty('transport');
  });

  it('forwards the api key (no transport) unchanged in the handshake', async () => {
    const tolgee = TolgeeCore().init({
      language: 'en',
      apiUrl: 'test',
      apiKey: 'tgpak_x',
    });
    tolgee.addPlugin(BrowserExtensionPlugin());
    await tolgee.run();
    expect(handshakerUpdate).toBeCalledWith(
      expect.objectContaining({
        config: expect.objectContaining({ apiKey: 'tgpak_x' }),
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

  it('builds proxy credentials from an OAuth session marker (no api key, no token in the page)', async () => {
    sessionStorage.setItem(API_URL_SESSION_STORAGE, 'test');
    sessionStorage.setItem(EXTENSION_SESSION_STORAGE, 'oauth');
    sessionStorage.setItem(PROJECT_ID_SESSION_STORAGE, '42');
    sessionStorage.setItem(BRANCH_SESSION_STORAGE, 'feat');

    const tolgee = TolgeeCore().init({ language: 'en' });
    tolgee.addPlugin(BrowserExtensionPlugin());
    await tolgee.run();

    expect(loadInContextLib).toBeCalledTimes(1);
    const credentials = credentialsPassedToInContextTools();
    expect(credentials.apiKey).toBeUndefined();
    expect(credentials.apiUrl).toEqual('test');
    expect(credentials.projectId).toEqual('42');
    expect(credentials.branch).toEqual('feat');
    expect(typeof credentials.transport).toBe('function');
    expect(Object.keys(credentials).sort()).toEqual([
      'apiUrl',
      'branch',
      'projectId',
      'transport',
    ]);
  });

  it('builds the same proxy credentials for an api-key session held by the extension (the key never reaches the page)', async () => {
    sessionStorage.setItem(API_URL_SESSION_STORAGE, 'test');
    sessionStorage.setItem(EXTENSION_SESSION_STORAGE, 'apiKey');
    sessionStorage.setItem(PROJECT_ID_SESSION_STORAGE, '42');

    const tolgee = TolgeeCore().init({ language: 'en' });
    tolgee.addPlugin(BrowserExtensionPlugin());
    await tolgee.run();

    expect(loadInContextLib).toBeCalledTimes(1);
    const credentials = credentialsPassedToInContextTools();
    expect(credentials.apiKey).toBeUndefined();
    expect(credentials.projectId).toEqual('42');
    expect(typeof credentials.transport).toBe('function');
  });

  it('does not load in-context lib for a session marker without a projectId', async () => {
    sessionStorage.setItem(API_URL_SESSION_STORAGE, 'test');
    sessionStorage.setItem(EXTENSION_SESSION_STORAGE, 'oauth');

    const tolgee = TolgeeCore().init({ language: 'en' });
    tolgee.addPlugin(BrowserExtensionPlugin());
    await tolgee.run();

    expect(loadInContextLib).not.toBeCalled();
  });

  it('prefers an api key applied by an older extension build over the session marker', async () => {
    sessionStorage.setItem(API_URL_SESSION_STORAGE, 'test');
    sessionStorage.setItem(API_KEY_SESSION_STORAGE, 'tgpak_x');
    sessionStorage.setItem(EXTENSION_SESSION_STORAGE, 'oauth');
    sessionStorage.setItem(PROJECT_ID_SESSION_STORAGE, '42');

    const tolgee = TolgeeCore().init({ language: 'en' });
    tolgee.addPlugin(BrowserExtensionPlugin());
    await tolgee.run();

    expect(loadInContextLib).toBeCalledTimes(1);
    const credentials = credentialsPassedToInContextTools();
    expect(credentials.apiKey).toEqual('tgpak_x');
    expect(credentials.transport).toBeUndefined();
  });

  it('uses a key the extension hands to the page for an SDK without proxy support (no session marker at all)', async () => {
    sessionStorage.setItem(API_URL_SESSION_STORAGE, 'test');
    sessionStorage.setItem(API_KEY_SESSION_STORAGE, 'tgpak_x');
    sessionStorage.setItem(PROJECT_ID_SESSION_STORAGE, '42');
    sessionStorage.setItem('__tolgee_projectKey', '42');

    const tolgee = TolgeeCore().init({ language: 'en' });
    tolgee.addPlugin(BrowserExtensionPlugin());
    await tolgee.run();

    expect(loadInContextLib).toBeCalledTimes(1);
    const credentials = credentialsPassedToInContextTools();
    expect(credentials.apiKey).toEqual('tgpak_x');
    expect(credentials.apiUrl).toEqual('test');
    expect(credentials.projectId).toEqual('42');
    expect(credentials.transport).toBeUndefined();
  });

  it('does not load in-context lib when apiUrl is missing', async () => {
    sessionStorage.setItem(EXTENSION_SESSION_STORAGE, 'oauth');
    sessionStorage.setItem(PROJECT_ID_SESSION_STORAGE, '42');

    const tolgee = TolgeeCore().init({ language: 'en' });
    tolgee.addPlugin(BrowserExtensionPlugin());
    await tolgee.run();

    expect(loadInContextLib).not.toBeCalled();
  });

  it('ignores any other value of the session marker', async () => {
    sessionStorage.setItem(API_URL_SESSION_STORAGE, 'test');
    sessionStorage.setItem(EXTENSION_SESSION_STORAGE, 'true');
    sessionStorage.setItem(PROJECT_ID_SESSION_STORAGE, '42');

    const tolgee = TolgeeCore().init({ language: 'en' });
    tolgee.addPlugin(BrowserExtensionPlugin());
    await tolgee.run();

    expect(loadInContextLib).not.toBeCalled();
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

  it('warns for an extension-signed-in SDK missing its projectId in dev mode', () => {
    const warn = jest
      .spyOn(console, 'warn')
      .mockImplementation(() => undefined);
    const tolgee = TolgeeCore().init({ language: 'en', apiUrl: 'http://x' });
    tolgee.overrideCredentials({ apiUrl: 'http://x', transport: jest.fn() });
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

  it('does not warn when not in dev mode, even if the credential would otherwise require a projectId', () => {
    // A transport but no apiUrl: isDev() is false, so the requiresExplicitProject check must not run.
    const warn = jest
      .spyOn(console, 'warn')
      .mockImplementation(() => undefined);
    const tolgee = TolgeeCore().init({ language: 'en', apiUrl: '' });
    tolgee.overrideCredentials({ apiUrl: '', transport: jest.fn() });
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
    sessionStorage.setItem(EXTENSION_SESSION_STORAGE, 'oauth');
    sessionStorage.setItem(PROJECT_ID_SESSION_STORAGE, 'e');
    // The chrome extension's own session-routing key, which the SDK never reads.
    sessionStorage.setItem('__tolgee_projectKey', 'f');
    clearSessionStorage();
    [
      API_KEY_SESSION_STORAGE,
      API_URL_SESSION_STORAGE,
      BRANCH_SESSION_STORAGE,
      EXTENSION_SESSION_STORAGE,
      PROJECT_ID_SESSION_STORAGE,
      '__tolgee_projectKey',
    ].forEach((key) => expect(sessionStorage.getItem(key)).toBeNull());
  });

  it('clearSessionStorage sweeps by prefix, so an extension-private key the SDK does not enumerate is still removed', () => {
    sessionStorage.setItem('__tolgee_someFutureExtensionKey', 'x');
    sessionStorage.setItem('unrelated_key', 'keep-me');
    clearSessionStorage();
    expect(
      sessionStorage.getItem('__tolgee_someFutureExtensionKey')
    ).toBeNull();
    expect(sessionStorage.getItem('unrelated_key')).toBe('keep-me');
  });

  it('builded module is valid', async () => {
    // this test works only after build
    const fileContent = await readFile(
      join(__dirname, `../../../dist/${IN_CONTEXT_FILE}`)
    );
    expect(
      fileContent.toString().includes(`"${IN_CONTEXT_UMD_NAME}"`)
    ).toBeTruthy();

    const module = await import(`../../../dist/${IN_CONTEXT_FILE}`);
    expect(typeof module[IN_CONTEXT_EXPORT_NAME]).toEqual('function');
  });
});
