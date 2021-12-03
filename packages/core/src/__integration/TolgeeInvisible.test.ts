jest.autoMockOff();

import { waitFor } from '@testing-library/dom';
import '@testing-library/jest-dom/extend-expect';
import { Tolgee } from '..';
import mockTranslations from './mockTranslations';
import fetchMock from 'jest-fetch-mock';
import { testConfig } from './testConfig';
import { decodeFromText } from '../helpers/secret';

const API_URL = 'http://localhost';
const API_KEY = 'dummyApiKey';

const fetch = fetchMock.mockResponse(async (req) => {
  if (req.url.includes('/v2/api-keys/current')) {
    return JSON.stringify(testConfig);
  } else if (req.url.includes('/v2/projects/translations/en')) {
    return JSON.stringify(mockTranslations);
  }

  throw new Error('Invalid request');
});

describe('Tolgee invisble mode', () => {
  let tolgee: Tolgee;
  beforeEach(async () => {
    fetch.enableMocks();
    tolgee = Tolgee.init({
      targetElement: document.body,
      apiKey: API_KEY,
      apiUrl: API_URL,
      wrapperMode: 'invisible',
    });
    document.body.innerHTML = '';
    await tolgee.run();
  });

  afterEach(() => {
    tolgee.stop();
  });

  it('handles translation in text', async () => {
    const translation = await tolgee.translate('hello_world');

    document.body.innerHTML = `<div id="test">${translation}</div>`;

    await waitFor(() => {
      return expect(
        // @ts-ignore
        document.getElementById('test')._tolgee
      ).not.toBeUndefined();
    });

    expect(
      decodeFromText(document.getElementById('test').textContent).length
    ).toEqual(0);
    expect(document.getElementById('test').textContent).toEqual('Hello world!');
  });

  it('handles missing translation in text', async () => {
    const translation = await tolgee.translate('nonexistant');

    document.body.innerHTML = `<div id="test">${translation}</div>`;

    await waitFor(() => {
      return expect(
        // @ts-ignore
        document.getElementById('test')._tolgee
      ).not.toBeUndefined();
    });

    expect(
      decodeFromText(document.getElementById('test').textContent).length
    ).toEqual(0);
    expect(document.getElementById('test').textContent).toEqual('nonexistant');
  });

  it('handles default value in text', async () => {
    const translation = await tolgee.translate({
      key: 'nonexistant',
      defaultValue: 'Default value!',
    });

    document.body.innerHTML = `<div id="test">${translation}</div>`;

    await waitFor(() => {
      return expect(
        // @ts-ignore
        document.getElementById('test')._tolgee
      ).not.toBeUndefined();
    });

    expect(
      decodeFromText(document.getElementById('test').textContent).length
    ).toEqual(0);
    expect(document.getElementById('test').textContent).toEqual(
      'Default value!'
    );
  });

  it('handles translation in attribute', async () => {
    const translation = await tolgee.translate('hello_world');

    document.body.innerHTML = `<div id="test" title="${translation}"></div>`;

    await waitFor(() => {
      return expect(
        // @ts-ignore
        document.getElementById('test')._tolgee
      ).not.toBeUndefined();
    });

    expect(
      decodeFromText(document.getElementById('test').getAttribute('title'))
        .length
    ).toEqual(0);
    expect(document.getElementById('test').getAttribute('title')).toEqual(
      'Hello world!'
    );
  });

  it('handles translation on select', async () => {
    const translation = await tolgee.translate('hello_world');

    document.body.innerHTML = `
      <select id="select">
        <option id="option">${translation}</option>
      </select>
    `;

    await waitFor(() => {
      return expect(
        // @ts-ignore
        document.getElementById('select')._tolgee
      ).not.toBeUndefined();
    });

    expect(
      decodeFromText(document.getElementById('option').textContent).length
    ).toEqual(0);
    expect(document.getElementById('option').textContent).toEqual(
      'Hello world!'
    );
  });
});
