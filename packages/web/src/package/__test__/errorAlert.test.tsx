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

  it.each(jwtCodes)('renders the sign-in-again recovery for %s', (code) => {
    const { container, root } = renderFor(code);
    expect(container.textContent).toContain("You're not signed in");
    expect(container.querySelector('button')?.textContent).toContain(
      'Open the Tolgee plugin'
    );
    act(() => root.unmount());
  });

  it('the recovery button posts the open-plugin message', () => {
    const spy = jest
      .spyOn(window, 'postMessage')
      .mockImplementation(() => undefined);
    const { container, root } = renderFor('expired_jwt_token');
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
  it('is informational, not an error, and offers both ways to sign in', () => {
    expect(severityFor(new HttpError('api_key_not_specified'))).toBe('info');
    expect(severityFor(new HttpError('invalid_jwt_token'))).toBe('error');
    expect(severityFor(new Error('boom'))).toBe('error');

    const { container, root } = renderFor('api_key_not_specified');
    expect(container.textContent).toContain('Sign in to make changes');
    expect(container.textContent).toContain('API key');
    expect(container.querySelector('button')?.textContent).toContain(
      'Open the Tolgee plugin'
    );
    act(() => root.unmount());
  });
});
