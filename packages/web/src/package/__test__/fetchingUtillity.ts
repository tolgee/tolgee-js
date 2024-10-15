export const createFetchingUtility = () => {
  const signalHandler = jest.fn();
  return {
    signalHandler,
    fetchMock: jest.fn(() =>
      Promise.resolve({
        json: () => ({
          status: 'ok',
        }),
        ok: true,
      } as unknown as Response)
    ),

    infiniteFetch: jest.fn(
      (_, { signal }: RequestInit) =>
        new Promise<Response>(() => {
          signal.addEventListener('abort', () =>
            signalHandler('Aborted with signal')
          );
        })
    ),
    failingFetch: jest.fn(() => Promise.reject(new Error('Fetch failed'))),
  };
};
