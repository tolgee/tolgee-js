import { createRoot, Root } from 'react-dom/client';
import { act } from 'react-dom/test-utils';
import type { UiProps } from '@tolgee/core';
import { QueryProvider } from '../ui/client/QueryProvider';
import { useGallery } from '../ui/KeyDialog/dialogContext/useGallery';
import { dispatchExtensionMessage as dispatch } from './testDispatch';

type Gallery = ReturnType<typeof useGallery>;

const settle = (ms = 20) =>
  act(async () => {
    await new Promise((resolve) => setTimeout(resolve, ms));
  });

// Stands in for the extension's relay on the page: records what the SDK posts and answers under the same id.
const relay = () => {
  const requests: { type: string; data: any }[] = [];
  const listener = (event: MessageEvent) => {
    if (event.data?.type === 'TOLGEE_PROXY_PING') {
      dispatch('TOLGEE_PROXY_PONG', { protocolVersion: 2 });
    }
    if (
      event.data?.type === 'TOLGEE_SCREENSHOT_UPLOAD' ||
      event.data?.type === 'TOLGEE_API_REQUEST'
    ) {
      requests.push(event.data);
    }
  };
  window.addEventListener('message', listener);
  return {
    requests,
    post: (type: string, data: Record<string, unknown>) => dispatch(type, data),
    detach: () => window.removeEventListener('message', listener),
  };
};

const render = (transport: UiProps['transport']) => {
  const revert = jest.fn();
  let gallery!: Gallery;
  const uiProps = {
    apiUrl: 'http://x',
    projectId: 7,
    transport,
    findPositions: jest.fn(() => [
      {
        keyName: 'k',
        keyNamespace: '',
        position: { x: 10, y: 20, width: 30, height: 40 },
      },
    ]),
    changeTranslation: jest.fn(() => ({ revert })),
  } as unknown as UiProps;
  const Probe = () => {
    gallery = useGallery(uiProps);
    return null;
  };
  const container = document.createElement('div');
  document.body.appendChild(container);
  const root: Root = createRoot(container);
  act(() => {
    root.render(
      <QueryProvider apiUrl="http://x" projectId={7} transport={transport}>
        <Probe />
      </QueryProvider>
    );
  });
  return {
    get gallery() {
      return gallery;
    },
    root,
    revert,
    uiProps,
  };
};

describe('useGallery through the extension', () => {
  let r: ReturnType<typeof relay>;
  beforeEach(() => {
    r = relay();
    Object.defineProperty(window, 'innerWidth', {
      value: 1000,
      writable: true,
    });
    Object.defineProperty(window, 'innerHeight', {
      value: 500,
      writable: true,
    });
  });
  afterEach(() => r.detach());

  it('hides the dialog until the capture, shows uploading until the reply, then lists the screenshot scaled to the image', async () => {
    const transport = jest.fn();
    const h = render(transport);
    expect(h.gallery.takingScreenshot).toBe(false);

    let done: Promise<void>;
    act(() => {
      done = h.gallery.handleTakeScreenshot('k', '', [['en', 'Hello']]);
    });
    expect(h.gallery.takingScreenshot).toBe(true);
    await settle(450);
    expect(r.requests).toHaveLength(1);
    expect(r.requests[0].type).toBe('TOLGEE_SCREENSHOT_UPLOAD');
    const id = r.requests[0].data.id;
    expect(h.gallery.screenshotsUploading).toBe(true);
    expect(h.revert).not.toHaveBeenCalled();

    r.post('TOLGEE_SCREENSHOT_CAPTURED', { id });
    await settle();
    expect(h.revert).toHaveBeenCalledTimes(1);
    expect(h.gallery.takingScreenshot).toBe(false);
    expect(h.gallery.screenshotsUploading).toBe(true);
    expect(h.gallery.screenshots).toEqual([]);

    r.post('TOLGEE_SCREENSHOT_UPLOADED', {
      id,
      response: {
        status: 201,
        statusText: 'Created',
        headers: { 'content-type': 'application/json' },
        body: '{"id":5,"filename":"s.png","fileUrl":"/s.png"}',
      },
      width: 2000,
      height: 1000,
    });
    await settle();
    await done!;
    expect(h.revert).toHaveBeenCalledTimes(1);
    expect(h.gallery.screenshotsUploading).toBe(false);
    expect(h.gallery.error).toBeFalsy();
    expect(h.gallery.screenshots).toEqual([
      {
        id: 5,
        filename: 's.png',
        fileUrl: '/s.png',
        width: 2000,
        height: 1000,
        justUploaded: true,
        keyReferences: [
          {
            keyId: -1,
            keyName: 'k',
            keyNamespace: '',
            position: { x: 20, y: 40, width: 60, height: 80 },
          },
        ],
        _internal: { version: null },
      },
    ]);
    expect(transport).not.toHaveBeenCalled();
  });

  it('puts the page back and reports the error when the extension refuses the upload', async () => {
    const h = render(jest.fn());
    act(() => {
      h.gallery.handleTakeScreenshot('k', '', [['en', 'Hello']]);
    });
    await settle(450);
    const id = r.requests[0].data.id;

    r.post('TOLGEE_SCREENSHOT_UPLOADED', {
      id,
      error: { kind: 'no_session', message: 'gone' },
    });
    await settle();
    expect(h.revert).toHaveBeenCalledTimes(1);
    expect(h.gallery.takingScreenshot).toBe(false);
    expect(h.gallery.screenshotsUploading).toBe(false);
    expect(h.gallery.error).toMatchObject({
      code: 'extension_session_missing',
    });
    expect(h.gallery.screenshots).toEqual([]);
  });

  it('surfaces a failed upload status through the same error path as a page-side upload', async () => {
    const h = render(jest.fn());
    act(() => {
      h.gallery.handleTakeScreenshot('k', '', [['en', 'Hello']]);
    });
    await settle(450);
    const id = r.requests[0].data.id;
    r.post('TOLGEE_SCREENSHOT_CAPTURED', { id });
    r.post('TOLGEE_SCREENSHOT_UPLOADED', {
      id,
      response: {
        status: 403,
        statusText: 'Forbidden',
        headers: {},
        body: '{"code":"operation_not_permitted","params":["screenshots.upload"]}',
      },
      width: 1,
      height: 1,
    });
    await settle();
    expect(h.gallery.error).toMatchObject({
      code: 'operation_not_permitted',
      params: ['screenshots.upload'],
    });
    expect(h.gallery.screenshots).toEqual([]);
  });
});
