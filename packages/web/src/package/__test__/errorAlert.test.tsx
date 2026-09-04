import { createRoot, Root } from 'react-dom/client';
import { act } from 'react-dom/test-utils';
import { getErrorContent, severityFor } from '../ui/KeyDialog/ErrorAlert';
import { HttpError, ErrorStatusCode } from '../ui/client/HttpError';
import { OPEN_PLUGIN_MESSAGE } from '../constants';

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

describe('ErrorAlert getErrorContent — OAuth recovery', () => {
  const jwtCodes = [
    'unauthenticated',
    'invalid_jwt_token',
    'expired_jwt_token',
    'general_jwt_error',
    // Emitted by OAuth2AccessTokenResolver for the extension's opaque Bearer token — a dead or revoked OAuth
    // session needs the same "reconnect via the plugin" recovery as a dead webapp JWT.
    'invalid_oauth_token',
    'oauth_token_expired',
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
});

describe('ErrorAlert — missing credentials', () => {
  it('is informational, not an error, and offers both ways to sign in', async () => {
    expect(severityFor(new HttpError('api_key_not_specified'))).toBe('info');
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
