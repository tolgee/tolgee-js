jest.dontMock('./useTranslate');
jest.mock('@tolgee/core');

import { useTranslate } from './useTranslate';
import { act, render, screen, waitFor } from '@testing-library/react';
import * as React from 'react';

let translatedValue;
const instantMock = jest.fn(() => translatedValue);
const translateMock = jest.fn().mockImplementation(async () => translatedValue);
const langChangeUnsubscribe = jest.fn();
const translationChangeUnsubscribe = jest.fn();

let langChangeCallback;
const langChangeSubscribeMock = jest.fn((cb) => {
  langChangeCallback = cb;
  return {
    unsubscribe: langChangeUnsubscribe,
  };
});

let translationChangeCallback;
const translationChangeSubscribeMock = jest.fn((cb) => {
  translationChangeCallback = cb;
  return {
    unsubscribe: translationChangeUnsubscribe,
  };
});

jest.mock('./useTolgeeContext', () => ({
  useTolgeeContext: () => ({
    tolgee: {
      instant: instantMock,
      translate: translateMock,
      onLangChange: {
        subscribe: langChangeSubscribeMock,
      },
      onTranslationChange: {
        subscribe: translationChangeSubscribeMock,
      },
    },
  }),
}));

describe('useTranslate hook', function () {
  const TestComponent = () => {
    const t = useTranslate();

    return (
      <>
        <span>{t('hello')}</span>
        <span>{t('hello2', { name: 'test' })}</span>
        <span>{t('hello3', undefined, true)}</span>
      </>
    );
  };

  let elements;

  beforeEach(async () => {
    jest.clearAllMocks();
    translatedValue = 'translated';
    render(<TestComponent />);
    await waitFor(() => {
      elements = screen.getAllByText('translated');
    });
  });

  test('proper result is rendered', () => {
    expect(elements).toHaveLength(3);
  });

  test('calls instant function', async () => {
    expect(instantMock).toBeCalledTimes(3);
  });

  test('calls instant function with proper params', async () => {
    expect(instantMock).toHaveBeenCalledWith(
      'hello',
      undefined,
      undefined,
      true
    );
    expect(instantMock).toHaveBeenCalledWith(
      'hello2',
      { name: 'test' },
      undefined,
      true
    );
    expect(instantMock).toHaveBeenCalledWith('hello3', undefined, true, true);
  });

  test('calls translate function with proper params', async () => {
    expect(translateMock).toHaveBeenCalledWith('hello', undefined, undefined);
    expect(translateMock).toHaveBeenCalledWith(
      'hello2',
      { name: 'test' },
      undefined
    );
    expect(translateMock).toHaveBeenCalledWith('hello3', undefined, true);
  });

  test('listens to language change', async () => {
    jest.clearAllMocks();
    translatedValue = 'translated in new lang';
    act(() => {
      langChangeCallback();
    });
    expect(translateMock).toBeCalledTimes(3);
    await waitFor(() => {
      elements = screen.getAllByText('translated in new lang');
    });
    expect(elements).toHaveLength(3);
  });

  test('listens to translation change', async () => {
    jest.clearAllMocks();
    translatedValue = 'translated changed';
    act(() => {
      translationChangeCallback({ key: 'hello2' });
    });
    expect(translateMock).toBeCalledTimes(1);
    await waitFor(() => {
      elements = screen.getAllByText('translated changed');
    });
    expect(elements).toHaveLength(1);
    expect(translateMock).toHaveBeenCalledWith(
      'hello2',
      { name: 'test' },
      undefined
    );
  });
});
