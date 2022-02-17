jest.dontMock('./useTranslate');
jest.dontMock('./tagsTools');
jest.mock('@tolgee/core');

import React from 'react';
import { act, render, screen, waitFor } from '@testing-library/react';

import { useTranslate } from './useTranslate';

const defaultTranslations = {
  hello: 'translated',
  hello2: 'translated',
  hello3: 'translated',
};

let translatedValues = defaultTranslations;
const instantMock = jest.fn(({ key }) => translatedValues[key]);
const translateMock = jest
  .fn()
  .mockImplementation(async ({ key }) => translatedValues[key]);
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
  describe('basics', () => {
    const TestComponent = () => {
      const t = useTranslate();

      return (
        <>
          <span>{t('hello')}</span>
          <span>{t('hello2', { name: 'test' })}</span>
          <span>{t('hello3', undefined, true, 'Default')}</span>
        </>
      );
    };

    let elements;

    beforeEach(async () => {
      jest.clearAllMocks();
      translatedValues = defaultTranslations;
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
      expect(instantMock).toHaveBeenCalledWith({
        defaultValue: undefined,
        key: 'hello',
        noWrap: undefined,
        orEmpty: true,
        params: undefined,
      });
      expect(instantMock).toHaveBeenCalledWith({
        defaultValue: undefined,
        key: 'hello2',
        noWrap: undefined,
        orEmpty: true,
        params: { name: 'test' },
      });
      expect(instantMock).toHaveBeenCalledWith({
        defaultValue: undefined,
        key: 'hello3',
        noWrap: true,
        orEmpty: true,
        params: undefined,
      });
    });

    test('calls translate function with proper params', async () => {
      expect(translateMock).toHaveBeenCalledWith({
        key: 'hello',
        params: undefined,
        noWrap: undefined,
        defaultValue: undefined,
      });
      expect(translateMock).toHaveBeenCalledWith({
        key: 'hello2',
        params: { name: 'test' },
        noWrap: undefined,
        defaultValue: undefined,
      });
      expect(translateMock).toHaveBeenCalledWith({
        key: 'hello3',
        params: undefined,
        noWrap: true,
        defaultValue: 'Default',
      });
    });

    test('listens to language change', async () => {
      jest.clearAllMocks();
      translatedValues = {
        hello: 'translated in new lang',
        hello2: 'translated in new lang',
        hello3: 'translated in new lang',
      };
      act(() => {
        langChangeCallback();
      });
      expect(translateMock).toBeCalledTimes(3);
      await waitFor(() => {
        elements = screen.getAllByText('translated in new lang');
      });
      expect(elements).toHaveLength(3);
      expect(translateMock).toHaveBeenCalledWith({
        key: 'hello3',
        params: undefined,
        noWrap: true,
        defaultValue: 'Default',
      });
    });

    test('listens to translation change', async () => {
      translatedValues = {
        ...translatedValues,
        hello2: 'translated changed',
      };
      jest.clearAllMocks();
      act(() => {
        translationChangeCallback({ key: 'hello2' });
      });
      expect(translateMock).toBeCalledTimes(1);
      await waitFor(() => {
        elements = screen.getAllByText('translated changed');
      });
      // expect(elements).toHaveLength(1);
      expect(translateMock).toHaveBeenCalledWith({
        key: 'hello2',
        params: { name: 'test' },
        noWrap: undefined,
        defaultValue: undefined,
      });
    });
  });

  describe('object params', () => {
    const TestComponent = () => {
      const t = useTranslate();

      return (
        <>
          <span>
            {t({
              key: 'hello',
              parameters: { name: 'test' },
              defaultValue: 'Default',
              noWrap: false,
            })}
          </span>
        </>
      );
    };

    beforeEach(async () => {
      jest.clearAllMocks();
      translatedValues = defaultTranslations;
      render(<TestComponent />);
      await waitFor(() => {
        screen.getByText('translated');
      });
    });

    test('calls instant function', async () => {
      expect(instantMock).toBeCalledTimes(1);
    });

    test('calls instant function with proper params', async () => {
      expect(instantMock).toHaveBeenCalledWith({
        defaultValue: undefined,
        key: 'hello',
        noWrap: false,
        orEmpty: true,
        params: { name: 'test' },
      });
    });

    test('calls translate function with proper params', async () => {
      expect(translateMock).toHaveBeenCalledWith({
        key: 'hello',
        params: { name: 'test' },
        noWrap: false,
        defaultValue: 'Default',
      });
    });
  });
});
