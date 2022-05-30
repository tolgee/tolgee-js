import { mockApiClient } from './mockApiClient';
import { Tolgee, TolgeeModule } from '..';

describe('Tolgee instance', () => {
  const getTranslations = jest.fn(async () => ({
    key: 'Value',
  }));
  beforeEach(() => {
    mockApiClient({ getTranslations });
  });

  it('Creates instace with create instance', () => {
    const instance = Tolgee.createInstance();
    expect(instance).toBeInstanceOf(Tolgee);
  });

  it('Creates instace with init', () => {
    const instance = Tolgee.init({});
    expect(instance).toBeInstanceOf(Tolgee);
  });

  it('Creates instance with use', () => {
    const instance = Tolgee.use({} as TolgeeModule);
    expect(instance).toBeInstanceOf(Tolgee);
  });

  it('Works with chanining', () => {
    const instance = Tolgee.createInstance()
      .use({} as TolgeeModule)
      .init({});
    expect(instance).toBeInstanceOf(Tolgee);
  });

  it('Fetches languages', async () => {
    const instance = Tolgee.init({});
    const data = await instance.loadTranslations('cs');
    expect(data['key']).toEqual('Value');
    expect(getTranslations).toBeCalledTimes(1);
  });

  it('Fetches two different languages', async () => {
    const instance = Tolgee.init({});
    const data = await instance.loadTranslations('cs');
    expect(data['key']).toEqual('Value');
    expect(getTranslations).toBeCalledTimes(1);
  });
});
