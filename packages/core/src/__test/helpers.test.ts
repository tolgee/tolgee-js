import { createFetchFunction } from '../helpers';

describe('createFetchFunction SDK headers', () => {
  const wrappedHeaders = (init?: RequestInit) => {
    const inner = jest.fn(() =>
      Promise.resolve({} as unknown as Response)
    ) as any;
    createFetchFunction(inner)('http://x', init);
    return inner.mock.calls[0][1].headers as Record<string, string>;
  };

  it('adds SDK type/version headers for an X-API-Key request', () => {
    const headers = wrappedHeaders({ headers: { 'x-api-key': 'tgpak_x' } });
    expect(headers['x-tolgee-sdk-type']).toEqual('JS');
    expect(headers['x-tolgee-sdk-version']).toBeDefined();
  });

  it('adds SDK type/version headers for a Bearer Authorization request', () => {
    const headers = wrappedHeaders({
      headers: { authorization: 'Bearer jwt' },
    });
    expect(headers['x-tolgee-sdk-type']).toEqual('JS');
    expect(headers['x-tolgee-sdk-version']).toBeDefined();
  });

  it('does not add SDK headers when no auth header is present', () => {
    const headers = wrappedHeaders({ headers: { 'content-type': 'x' } });
    expect(headers['x-tolgee-sdk-type']).toBeUndefined();
  });
});
