export const createFetchingUtility = () => {
  const signalHandler = jest.fn();
  return {
    signalHandler,
    fetchMock: jest.fn(() =>
      Promise.resolve({
        json: () =>
          Promise.resolve({
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
    fetchWithResponse: (
      response: any = {
        status: 'ok',
      }
    ) =>
      jest.fn(() =>
        Promise.resolve({
          json: () => Promise.resolve(response),
          ok: true,
        } as unknown as Response)
      ),
  };
};
