import { createRoot, Root } from 'react-dom/client';
import { act } from 'react-dom/test-utils';
import {
  ErrorAlert,
  getErrorContent,
  severityFor,
} from '../ui/KeyDialog/ErrorAlert';
import {
  HttpError,
  ErrorStatusCode,
  isHttpError,
} from '../ui/client/HttpError';
import { OPEN_PLUGIN_MESSAGE } from '../constants';

jest.mock('../ui/KeyDialog/dialogContext', () => ({
  useDialogContext: (select: (c: unknown) => unknown) =>
    select({ uiProps: { apiUrl: 'http://x' } }),
}));

class OtherBundleHttpError extends Error {
  constructor(
    public code: string,
    public status?: number
  ) {
    super(`${status ?? ''}: ${code}`);
  }
}

const renderFor = (code: string) => {
  const container = document.createElement('div');
  document.body.appendChild(container);
  const root: Root = createRoot(container);
  act(() => {
    root.render(
      getErrorContent(new HttpError(code as ErrorStatusCode), 'http://x') as any
    );
  });
  return { container, root };
};

// The extension's content script answers TOLGEE_PING with TOLGEE_PONG; stand in for it.
const withExtension = () => {
  const answer = (e: MessageEvent) => {
    if (e.data?.type === 'TOLGEE_PING') {
      window.postMessage({ type: 'TOLGEE_PONG' }, window.origin);
    }
  };
  window.addEventListener('message', answer);
  return () => window.removeEventListener('message', answer);
};

const settle = (ms = 50) =>
  act(async () => {
    await new Promise((resolve) => setTimeout(resolve, ms));
  });

const buttons = (container: HTMLElement) =>
  [...container.querySelectorAll('button, a')].map((b) => b.textContent);

describe('ErrorAlert getErrorContent: OAuth recovery', () => {
  const jwtCodes = [
    'unauthenticated',
    'invalid_jwt_token',
    'expired_jwt_token',
    'general_jwt_error',
    // Emitted by OAuth2AccessTokenResolver for the extension's opaque Bearer token — a dead or revoked OAuth
    // session needs the same "reconnect via the plugin" recovery as a dead webapp JWT.
    'invalid_oauth_token',
    'oauth_token_expired',
    // Answered by the extension itself when the page it proxies for has no session.
    'extension_session_missing',
  ];

  it.each(jwtCodes)(
    'renders the sign-in-again recovery for %s',
    async (code) => {
      const detach = withExtension();
      const { container, root } = renderFor(code);
      await settle();
      expect(container.textContent).toContain("You're not signed in");
      expect(buttons(container)).toContain('Open the Tolgee plugin');
      act(() => root.unmount());
      detach();
    }
  );

  it('the recovery button posts the open-plugin message', async () => {
    const detach = withExtension();
    const { container, root } = renderFor('expired_jwt_token');
    await settle();
    detach();
    const spy = jest
      .spyOn(window, 'postMessage')
      .mockImplementation(() => undefined);
    act(() => {
      container
        .querySelector('button')
        ?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    });
    expect(spy).toHaveBeenCalledWith(
      { type: OPEN_PLUGIN_MESSAGE },
      window.origin
    );
    spy.mockRestore();
    act(() => root.unmount());
  });

  it('renders the missing-projectId guidance', () => {
    const { container, root } = renderFor('project_id_not_specified');
    expect(container.textContent).toContain('project id');
    act(() => root.unmount());
  });

  it('names the payload cap when the extension refuses an oversized image', () => {
    const { container, root } = renderFor('extension_request_too_large');
    expect(container.textContent).toContain('Image is too large to upload');
    expect(container.textContent).toContain('too large for the Tolgee plugin');
    act(() => root.unmount());
  });
});

describe('ErrorAlert: missing credentials', () => {
  it('is informational, not an error, whether the page or the extension holds no session, and offers both ways to sign in', async () => {
    expect(severityFor(new HttpError('api_key_not_specified'))).toBe('info');
    expect(severityFor(new HttpError('extension_session_missing', 401))).toBe(
      'info'
    );
    expect(severityFor(new HttpError('invalid_jwt_token'))).toBe('error');
    expect(severityFor(new Error('boom'))).toBe('error');

    const detach = withExtension();
    const { container, root } = renderFor('api_key_not_specified');
    await settle();
    expect(container.textContent).toContain('Sign in to make changes');
    expect(container.textContent).toContain('API key');
    expect(buttons(container)).toContain('Open the Tolgee plugin');
    act(() => root.unmount());
    detach();
  });

  it('says editing is switched off, as information, and offers to reopen the plugin rather than to sign in', async () => {
    expect(severityFor(new HttpError('extension_editing_off'))).toBe('info');

    const detach = withExtension();
    const { container, root } = renderFor('extension_editing_off');
    await settle();
    expect(container.textContent).toContain(
      'In-context editing is switched off'
    );
    expect(container.textContent).toContain(
      'You switched editing off for this page in the Tolgee plugin. Turn it on to edit here.'
    );
    expect(container.textContent).not.toContain('Sign in');
    expect(buttons(container)).toContain('Open the Tolgee plugin');
    act(() => root.unmount());
    detach();
  });

  it('tags the alert with the error code it renders', () => {
    const container = document.createElement('div');
    document.body.appendChild(container);
    const root: Root = createRoot(container);
    act(() => {
      root.render(
        <ErrorAlert error={new HttpError('extension_editing_off')} />
      );
    });
    const alert = container.querySelector('[data-cy="error-alert"]');
    expect(alert?.getAttribute('data-cy-error-code')).toBe(
      'extension_editing_off'
    );
    act(() => root.unmount());
  });

  it('offers the store link instead when no extension answers', async () => {
    const { container, root } = renderFor('api_key_not_specified');
    // detectExtension gives up after two 300 ms attempts.
    await settle(800);
    expect(buttons(container)).toContain('Install the Tolgee plugin');
    expect(buttons(container)).not.toContain('Open the Tolgee plugin');
    const links = [...container.querySelectorAll('a')].map((a) =>
      a.getAttribute('href')
    );
    expect(links.some((h) => h?.includes('chrome.google.com/webstore'))).toBe(
      true
    );
    act(() => root.unmount());
  });
});

describe('ErrorAlert: cross-bundle HttpError', () => {
  it('is recognised by isHttpError although it is not an instance of the local HttpError class', () => {
    const foreign = new OtherBundleHttpError('extension_session_missing', 401);

    expect(foreign).not.toBeInstanceOf(HttpError);
    expect(isHttpError(foreign)).toBe(true);
  });

  it('renders the extension_session_missing content for a cross-bundle error, not its raw message', () => {
    const foreign = new OtherBundleHttpError('extension_session_missing', 401);

    const container = document.createElement('div');
    document.body.appendChild(container);
    const root: Root = createRoot(container);
    act(() => {
      root.render(<ErrorAlert error={foreign} />);
    });
    expect(container.textContent).toContain("You're not signed in");
    expect(container.textContent).not.toContain('extension_session_missing');
    act(() => root.unmount());
  });

  it('scores severity for a cross-bundle api_key_not_specified as informational, not an error', () => {
    const foreign = new OtherBundleHttpError('api_key_not_specified');
    expect(severityFor(foreign as unknown as HttpError)).toBe('info');
  });
});
