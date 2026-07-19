import { TolgeeInstance } from '@tolgee/web';
import { createServerInstance } from './createServerInstance';

jest.mock('react', () => ({
  ...jest.requireActual('react'),
  cache: (callback: unknown) => callback,
}));

describe('createServerInstance', () => {
  const createTolgeeMock = () => {
    const run = jest.fn().mockResolvedValue(undefined);
    const t = jest.fn();
    const tolgee = { run, t } as unknown as TolgeeInstance;
    const createTolgee = jest.fn().mockResolvedValue(tolgee);

    return { createTolgee, run, t, tolgee };
  };

  it('uses the configured locale resolver by default', async () => {
    const { createTolgee, run, tolgee } = createTolgeeMock();
    const getLocale = jest.fn().mockResolvedValue('en');
    const { getTolgee } = createServerInstance({ createTolgee, getLocale });

    await expect(getTolgee()).resolves.toBe(tolgee);
    expect(getLocale).toHaveBeenCalledTimes(1);
    expect(createTolgee).toHaveBeenCalledWith('en');
    expect(run).toHaveBeenCalledTimes(1);
  });

  it('skips locale detection when an explicit locale is provided', async () => {
    const { createTolgee, t } = createTolgeeMock();
    const getLocale = jest.fn().mockResolvedValue('en');
    const { getTranslate } = createServerInstance({ createTolgee, getLocale });

    await expect(getTranslate('cs')).resolves.toBe(t);
    expect(getLocale).not.toHaveBeenCalled();
    expect(createTolgee).toHaveBeenCalledWith('cs');
  });
});
