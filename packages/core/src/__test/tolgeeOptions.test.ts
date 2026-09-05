import { DevApiTransport, DevCredentials, TolgeeOptions } from '../types';

describe('TolgeeOptions', () => {
  it('does not accept the extension transport, which only enters through overrideCredentials', () => {
    const transport: DevApiTransport = () =>
      Promise.reject(new Error('unused'));
    // @ts-expect-error transport is not an init option
    const options: TolgeeOptions = { transport };
    const credentials: DevCredentials = { transport, projectId: 1 };

    expect(options).toBeDefined();
    expect(credentials.transport).toBe(transport);
  });
});
