jest.autoMockOff();

import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import mockTranslations from './mockTranslations';
import fetchMock from 'jest-fetch-mock';
import { testConfig } from './testConfig';
import { TolgeeProvider, useTranslate } from '..';
import { render, screen, waitFor } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import { Tolgee } from '@tolgee/core';
import { useTolgeeContext } from '../useTolgeeContext';

const API_URL = 'http://localhost';
const API_KEY = 'dummyApiKey';

const fetch = fetchMock.mockResponse(async (req) => {
  if (req.url.includes('/v2/api-keys/current')) {
    return JSON.stringify(testConfig);
  } else if (req.url.includes('/v2/projects/translations/en')) {
    return JSON.stringify({ en: mockTranslations.en });
  } else if (req.url.includes('/v2/projects/translations/cs')) {
    return JSON.stringify({ cs: mockTranslations.cs });
  }

  throw new Error('Invalid request');
});

describe('useTolgee integration', () => {
  let tolgee: Tolgee;
  const TestComponent = () => {
    const t = useTranslate();
    tolgee = useTolgeeContext().tolgee;

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
        <div data-testid="with_tags">
          {t('with_tags', { b: <b />, i: <i /> })}
        </div>
        <div data-testid="with_tag_default">
          {t(
            'non_existant',
            { b: <b />, i: (chunks: any) => <i>{chunks}</i> },
            '<b><i>default</i></b>'
          )}
        </div>
        <div data-testid="with_tags_default">
          {t(
            'non_existant',
            { b: <b />, i: <i /> },
            '<b>default</b><i>value</i>'
          )}
        </div>
        <div data-testid="non_formatted">
          {t('non_existant', '<i>non_formatted</i>')}
        </div>
      </>
    );
  };

  beforeEach(async () => {
    fetch.enableMocks();
    act(() => {
      render(
        <TolgeeProvider
          apiUrl={API_URL}
          apiKey={API_KEY}
          loadingFallback="Loading..."
          defaultLanguage="cs"
          fallbackLanguage="en"
        >
          <TestComponent />
        </TolgeeProvider>
      );
    });
    await waitFor(() => {
      expect(screen.queryByTestId('hello_world')).toContainHTML('Ahoj světe!');
    });
  });

  it('wraps translation correctly', async () => {
    expect(screen.queryByTestId('hello_world')).toContainHTML('Ahoj světe!');
    expect(screen.queryByTestId('hello_world')).toHaveProperty('_tolgee');
  });

  it('works with noWrap', () => {
    expect(screen.queryByTestId('hello_world_no_wrap')).toContainHTML(
      'Ahoj světe!'
    );
    expect(screen.queryByTestId('hello_world_no_wrap')).not.toHaveProperty(
      '_tolgee'
    );
  });

  it('works with parameters', () => {
    expect(screen.queryByTestId('peter_dogs')).toContainHTML('Petr má 5 psů.');
    expect(screen.queryByTestId('peter_dogs')).toHaveProperty('_tolgee');
  });

  it('works with default value', async () => {
    expect(screen.queryByTestId('non_existant')).toContainHTML('Non existant');
    expect(screen.queryByTestId('non_existant')).toHaveProperty('_tolgee');
  });

  it('works with tags', () => {
    expect(screen.queryByTestId('with_tags')).toContainHTML(
      'Tento <b>text <i>je</i> formátovaný</b>'
    );
    expect(screen.queryByTestId('with_tags')).toHaveProperty('_tolgee');
  });

  it('works with one tag in default value', async () => {
    await waitFor(() => {
      expect(screen.queryByTestId('with_tag_default')).toContainHTML(
        '<b><i>default</i></b>'
      );
    });
    expect(screen.queryByTestId('with_tag_default')).toHaveProperty('_tolgee');
  });

  it('works with tags in default value', async () => {
    await waitFor(() => {
      expect(screen.queryByTestId('with_tags_default')).toContainHTML(
        '<b>default</b><i>value</i>'
      );
    });
    expect(screen.queryByTestId('with_tags_default')).toHaveProperty('_tolgee');
  });

  it('works with tags in default value', async () => {
    await waitFor(() => {
      expect(screen.queryByTestId('non_formatted').textContent).toContain(
        '<i>non_formatted</i>'
      );
    });
    expect(screen.queryByTestId('non_formatted')).toHaveProperty('_tolgee');
  });

  describe('language switch', () => {
    beforeEach(async () => {
      await act(async () => {
        await tolgee.changeLanguage('en');
      });
    });

    it('changes translation with tags', () => {
      expect(screen.queryByTestId('with_tags')).toContainHTML(
        'This <b>text <i>is</i> formatted</b>'
      );
      expect(screen.queryByTestId('with_tags')).toHaveProperty('_tolgee');
    });
  });
});
