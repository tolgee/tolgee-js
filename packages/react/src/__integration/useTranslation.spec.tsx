import React, { act } from 'react';
import '@testing-library/jest-dom';
import { DevTools, useTranslate, GlobalContextPlugin } from '..';
import { render, screen, waitFor } from '@testing-library/react';
import { Tolgee, TolgeeInstance } from '@tolgee/web';
import { FormatIcu } from '@tolgee/format-icu';
import { mockCoreFetch } from '@tolgee/testing/fetchMock';

const API_URL = 'http://localhost';
const API_KEY = 'dummyApiKey';

const fetch = mockCoreFetch();

describe('useTranslation hook integration', () => {
  let tolgee: TolgeeInstance;
  const TestComponent = () => {
    const { t } = useTranslate();

    expect(typeof t('peter_dogs', { dogsCount: '5' })).toEqual('string');
    expect(typeof t('non_existant', '<i>non_formatted</i>')).toEqual('string');
    expect(
      typeof t('non_existant', '<i>{parameter}</i>', { parameter: 'test' })
    ).toEqual('string');

    return (
      <>
        <div data-testid="peter_dogs">
          {t('peter_dogs', { dogsCount: '5' })}
        </div>
        <div data-testid="hello_world">{t('hello_world')}</div>
        <div data-testid="hello_world_no_wrap">
          {t({ key: 'hello_world', noWrap: true })}
        </div>
        <div data-testid="non_existant">
          {t('non_existant', 'Non existant')}
        </div>
        <div data-testid="non_formatted">
          {t('non_existant', '<i>non_formatted</i>')}
        </div>
      </>
    );
  };

  beforeEach(async () => {
    fetch.enableMocks();
    tolgee = Tolgee()
      .use(DevTools())
      .use(GlobalContextPlugin({ useSuspense: false }))
      .use(FormatIcu())
      .init({
        apiUrl: API_URL,
        apiKey: API_KEY,
        language: 'cs',
        fallbackLanguage: 'en',
      });
    tolgee.run();
    act(() => {
      render(<TestComponent />);
    });
    await waitFor(() => {
      expect(screen.queryByTestId('hello_world')).toContainHTML('Ahoj světe!');
    });
  });

  afterEach(() => {
    tolgee.stop();
  });

  it('wraps translation correctly', async () => {
    await waitFor(() => {
      expect(screen.queryByTestId('hello_world')).toContainHTML('Ahoj světe!');
      expect(screen.queryByTestId('hello_world')).toHaveAttribute('_tolgee');
    });
  });

  it('works with noWrap', async () => {
    await waitFor(() => {
      expect(screen.queryByTestId('hello_world_no_wrap')).toContainHTML(
        'Ahoj světe!'
      );
      expect(screen.queryByTestId('hello_world_no_wrap')).not.toHaveAttribute(
        '_tolgee'
      );
    });
  });

  it('works with parameters', async () => {
    await waitFor(() => {
      expect(screen.queryByTestId('peter_dogs')).toContainHTML(
        'Petr má 5 psů.'
      );
      expect(screen.queryByTestId('peter_dogs')).toHaveAttribute('_tolgee');
    });
  });

  it('works with default value', async () => {
    expect(screen.queryByTestId('non_existant')).toContainHTML('Non existant');
    expect(screen.queryByTestId('non_existant')).toHaveAttribute('_tolgee');
  });

  it('works with tags in default value', async () => {
    await waitFor(() => {
      expect(screen.queryByTestId('non_formatted')?.textContent).toContain(
        '<i>non_formatted</i>'
      );
    });
    expect(screen.queryByTestId('non_formatted')).toHaveAttribute('_tolgee');
  });

  describe('language switch', () => {
    beforeEach(async () => {
      await act(async () => {
        await tolgee.changeLanguage('en');
      });
    });

    it('changes translation', async () => {
      expect(screen.queryByTestId('hello_world')).toContainHTML('Hello world!');
      expect(screen.queryByTestId('hello_world')).toHaveAttribute('_tolgee');
    });
  });
});
