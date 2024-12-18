import React, { act } from 'react';
import '@testing-library/jest-dom';
import { render, screen, waitFor } from '@testing-library/react';
import { TolgeeProvider, DevTools, TolgeeInstance, Tolgee } from '../index';
import { FormatIcu } from '@tolgee/format-icu';
import { mockCoreFetch } from '@tolgee/testing/fetchMock';

import { T } from '../index';

const API_URL = 'http://localhost';
const API_KEY = 'dummyApiKey';

const fetch = mockCoreFetch();

describe('T component integration', () => {
  let tolgee: TolgeeInstance;
  const TestComponent = () => {
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
        <div data-testid="default_value_in_params">
          <T keyName="non_existant" defaultValue="Non existant" />
        </div>
        <div data-testid="with_tags">
          <T keyName="with_tags" params={{ b: <b />, i: <i /> }} />
        </div>
        <div data-testid="with_empty_tag">
          <T
            keyName="with_empty_tag"
            params={{ br: <br /> }}
            defaultValue="Here is empty<br></br>tag"
          />
        </div>
        <div data-testid="with_children_conflict">
          <T
            keyName="with_children_conflict"
            params={{
              b: <b>should</b>,
            }}
            defaultValue="This <b>shouldn't</b> be here"
          />
        </div>
        <div data-testid="with_tag">
          <T
            keyName="with_tag"
            params={{
              b: (text: string) => <b title={text}>{text}</b>,
            }}
          />
        </div>
        <div data-testid="with_language_prop">
          <T keyName="hello_world" language="en" />
        </div>
      </>
    );
  };

  beforeEach(async () => {
    fetch.enableMocks();
    tolgee = Tolgee().use(DevTools()).use(FormatIcu()).init({
      apiUrl: API_URL,
      apiKey: API_KEY,
      language: 'cs',
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
      expect(screen.queryByTestId('hello_world')?.textContent).toContain(
        'Ahoj světe!'
      );
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

  it('works with default value in params', async () => {
    expect(screen.queryByTestId('default_value_in_params')).toContainHTML(
      'Non existant'
    );
    expect(screen.queryByTestId('default_value_in_params')).toHaveAttribute(
      '_tolgee'
    );
  });

  it('works with tags', () => {
    expect(screen.queryByTestId('with_tags')).toContainHTML(
      'Tento <b>text <i>je</i> formátovaný</b>'
    );
    expect(screen.queryByTestId('with_tags')).toHaveAttribute('_tolgee');
  });

  it('works with empty tag', () => {
    expect(screen.queryByTestId('with_empty_tag')).toContainHTML(
      'Here is empty<br />tag'
    );
    expect(screen.queryByTestId('with_empty_tag')).toHaveAttribute('_tolgee');
  });

  it("won't pass children if the element already has children", () => {
    expect(screen.queryByTestId('with_children_conflict')).toContainHTML(
      'This <b>should</b> be here'
    );
    expect(screen.queryByTestId('with_children_conflict')).toHaveAttribute(
      '_tolgee'
    );
  });

  it('works with tag as function', () => {
    expect(screen.queryByTestId('with_tag')).toContainHTML(
      '<b title="bold">bold</b>'
    );
    expect(screen.queryByTestId('with_tag')).toHaveAttribute('_tolgee');
  });

  it('works with language prop', () => {
    expect(screen.queryByTestId('with_language_prop')).toContainHTML(
      'Hello world!'
    );
    expect(screen.queryByTestId('with_language_prop')).toHaveAttribute(
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
      expect(screen.queryByTestId('with_tags')).toHaveAttribute('_tolgee');
    });
  });
});
