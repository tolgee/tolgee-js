jest.autoMockOff();

import '@testing-library/jest-dom';
import { mockCoreFetch } from '@tolgee/testing/fetchMock';
import i18n from 'i18next';
import { DevTools, Tolgee } from '@tolgee/web';
import { withTolgee, I18nextPlugin } from '..';

const API_URL = 'http://localhost';
const API_KEY = 'dummyApiKey';

const fetch = mockCoreFetch();

describe('withTolgee', () => {
  let i18next: typeof i18n;
  beforeEach(async () => {
    fetch.enableMocks();
  });

  afterEach(() => {
    i18next?.tolgee?.stop();
  });

  it('loads static data first', async () => {
    const tolgee = Tolgee()
      .use(DevTools())
      .use(I18nextPlugin())
      .init({
        staticData: {
          'en:translation': {
            hello_world: 'Hello static!',
          },
        },
      });

    i18next = withTolgee(i18n.createInstance(), tolgee);
    await i18next.init({ lng: 'en', supportedLngs: ['en'] });
    expect(i18next.t('hello_world')).toContain('Hello static!');
  });

  it('loads dev data over static data', async () => {
    const tolgee = Tolgee()
      .use(DevTools())
      .use(I18nextPlugin())
      .init({
        apiUrl: API_URL,
        apiKey: API_KEY,
        staticData: {
          'en:translation': {
            hello_world: 'Hello static!',
          },
        },
      });

    i18next = withTolgee(i18n.createInstance(), tolgee);
    await i18next.init({ lng: 'en', supportedLngs: ['en'] });
    expect(i18next.t('hello_world')).toContain('Hello world!');
  });

  it('loads dev data on lang change', async () => {
    const tolgee = Tolgee()
      .use(DevTools())
      .use(I18nextPlugin())
      .init({
        apiUrl: API_URL,
        apiKey: API_KEY,
        staticData: {
          'en:translation': {
            hello_world: 'Hello static!',
          },
        },
      });

    i18next = withTolgee(i18n.createInstance(), tolgee);
    await i18next.init({ lng: 'en', supportedLngs: ['en', 'cs'] });
    expect(i18next.t('hello_world')).toContain('Hello world!');
    await i18next.changeLanguage('cs');
    expect(i18next.t('hello_world')).toContain('Ahoj světe!');
  });
});
