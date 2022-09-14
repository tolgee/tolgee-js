jest.autoMockOff();

import fetchMock from 'jest-fetch-mock';
import { act } from 'react-dom/test-utils';
import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import { render, screen, waitFor } from '@testing-library/react';
import { TolgeeProvider, ReactPlugin, TolgeeInstance, Tolgee } from '../index';
import { IcuPlugin } from '@tolgee/icu-formatter';

import mockTranslations from './mockTranslations';
import { testConfig } from './testConfig';
import { T } from '../index';
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

describe('T component integration', () => {
  let tolgee: TolgeeInstance;
  const TestComponent = () => {
    tolgee = useTolgeeContext();
    return (
      <>
        <div data-testid="peter_dogs">
          <T keyName="peter_dogs" params={{ dogsCount: 5 }} />
        </div>
        <div data-testid="hello_world">
          <T>hello_world</T>
        </div>
        <div data-testid="hello_world_no_wrap">
          <T noWrap>hello_world</T>
        </div>
        <div data-testid="non_existant">
          <T keyName="non_existant">Non existant</T>
        </div>
        <div data-testid="with_tags">
          <T keyName="with_tags" params={{ b: <b />, i: <i /> }} />
        </div>
        <div data-testid="with_tag">
          <T
            keyName="with_tag"
            params={{
              b: (text: string) => <b title={text}>{text}</b>,
            }}
          />
        </div>
      </>
    );
  };

  beforeEach(async () => {
    fetch.enableMocks();
    tolgee = Tolgee().use(ReactPlugin()).use(IcuPlugin()).init({
      apiUrl: API_URL,
      apiKey: API_KEY,
      defaultLanguage: 'cs',
      fallbackLanguage: 'en',
    });
    act(() => {
      render(
        <TolgeeProvider tolgee={tolgee} fallback="Loading...">
          <TestComponent />
        </TolgeeProvider>
      );
    });
    await waitFor(() => {
      expect(screen.queryByTestId('hello_world')).toContainHTML('Ahoj světe!');
      expect(screen.queryByTestId('hello_world')).toHaveAttribute(
        '_tolgee',
        'true'
      );
    });
  });

  it('wraps translation correctly', async () => {
    expect(screen.queryByTestId('hello_world')).toContainHTML('Ahoj světe!');
    expect(screen.queryByTestId('hello_world')).toHaveAttribute('_tolgee');
  });

  it('works with no wrap', () => {
    expect(screen.queryByTestId('hello_world_no_wrap')).toContainHTML(
      'Ahoj světe!'
    );
    expect(screen.queryByTestId('hello_world_no_wrap')).not.toHaveAttribute(
      '_tolgee'
    );
  });

  it('works with parameters', () => {
    expect(screen.queryByTestId('peter_dogs')).toContainHTML('Petr má 5 psů.');
    expect(screen.queryByTestId('peter_dogs')).toHaveAttribute('_tolgee');
  });

  it('works with default value', async () => {
    expect(screen.queryByTestId('non_existant')).toContainHTML('Non existant');
    expect(screen.queryByTestId('non_existant')).toHaveAttribute('_tolgee');
  });

  it('works with tags', () => {
    expect(screen.queryByTestId('with_tags')).toContainHTML(
      'Tento <b>text <i>je</i> formátovaný</b>'
    );
    expect(screen.queryByTestId('with_tags')).toHaveAttribute('_tolgee');
  });

  it('works with tag as function', () => {
    expect(screen.queryByTestId('with_tag')).toContainHTML(
      '<b title="bold">bold</b>'
    );
    expect(screen.queryByTestId('with_tag')).toHaveAttribute('_tolgee');
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
      expect(screen.queryByTestId('with_tags')).toHaveAttribute('_tolgee');
    });
  });
});
