jest.autoMockOff();

import fetchMock from 'jest-fetch-mock';
import { act } from 'react-dom/test-utils';
import React from 'react';
import { Tolgee } from '@tolgee/core';
import '@testing-library/jest-dom/extend-expect';
import { render, screen, waitFor } from '@testing-library/react';

import mockTranslations from './mockTranslations';
import { testConfig } from './testConfig';
import { TolgeeProvider, T } from '..';
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
    tolgee = useTolgeeContext().tolgee;
    return (
      <>
        <div data-testid="peter_dogs">
          <T keyName="peter_dogs" parameters={{ dogsCount: 5 }} />
        </div>
        <div data-testid="hello_world">
          <T>hello_world</T>
        </div>
        <div data-testid="hello_world_no_wrap">
          <T strategy="NO_WRAP">hello_world</T>
        </div>
        <div data-testid="hello_world_text_wrap">
          <T strategy="TEXT_WRAP">hello_world</T>
        </div>
        <div data-testid="non_existant">
          <T keyName="non_existant">Non existant</T>
        </div>
        <div data-testid="with_tags">
          <T keyName="with_tags" parameters={{ b: <b />, i: <i /> }} />
        </div>
        <div data-testid="with_tag">
          <T
            keyName="with_tag"
            parameters={{
              b: (text: string) => <b title={text}>{text}</b>,
            }}
          />
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
    expect(screen.queryByTestId('hello_world').firstChild).toHaveProperty(
      '_tolgee'
    );
    const translated = screen.queryByTestId('hello_world').firstElementChild;
    expect(translated.getAttribute('data-tolgee-key-only')).toEqual(
      'hello_world'
    );
  });

  it('works with no wrap', () => {
    expect(screen.queryByTestId('hello_world_no_wrap')).toContainHTML(
      'Ahoj světe!'
    );
    expect(
      screen.queryByTestId('hello_world_no_wrap').firstChild
    ).not.toHaveProperty('_tolgee');
  });

  it('works with text wrap', () => {
    expect(screen.queryByTestId('hello_world_text_wrap')).toContainHTML(
      'Ahoj světe!'
    );
    expect(screen.queryByTestId('hello_world_text_wrap')).toHaveProperty(
      '_tolgee'
    );
  });

  it('works with parameters', () => {
    expect(screen.queryByTestId('peter_dogs')).toContainHTML('Petr má 5 psů.');
    expect(screen.queryByTestId('peter_dogs').firstChild).toHaveProperty(
      '_tolgee'
    );
  });

  it('works with default value', async () => {
    expect(screen.queryByTestId('non_existant')).toContainHTML('Non existant');
    expect(screen.queryByTestId('non_existant').firstChild).toHaveProperty(
      '_tolgee'
    );
  });

  it('works with tags', () => {
    expect(screen.queryByTestId('with_tags')).toContainHTML(
      'Tento <b>text <i>je</i> formátovaný</b>'
    );
    expect(screen.queryByTestId('with_tags').firstChild).toHaveProperty(
      '_tolgee'
    );
  });

  it('works with tag as function', () => {
    expect(screen.queryByTestId('with_tag')).toContainHTML(
      '<b title="bold">bold</b>'
    );
    expect(screen.queryByTestId('with_tag').firstChild).toHaveProperty(
      '_tolgee'
    );
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
      expect(screen.queryByTestId('with_tags').firstChild).toHaveProperty(
        '_tolgee'
      );
    });
  });
});
