jest.dontMock('./T');
jest.dontMock('./mocks/mockTolgee');
jest.mock('@tolgee/core');

import { Tolgee } from '@tolgee/core';
import { render, screen, waitFor } from '@testing-library/vue';
import { TolgeeContext } from './types';
import { T } from './T';
import { mockTolgee } from './mocks/mockTolgee';

export const prepareRender = () => {
  const tolgeeMock = mockTolgee();
  const tolgeeContext: TolgeeContext = {
    tolgee: tolgeeMock.tolgee as Tolgee,
  };

  return {
    ...tolgeeMock,
    render: (opts?: {
      content?: string;
      tComponentProps?: Record<string, unknown>;
    }) =>
      render(T, {
        props: {
          ...opts?.tComponentProps,
        },
        global: {
          provide: {
            tolgeeContext,
          },
        },
      }),
  };
};

describe('T component', function () {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('wraps text with span by default', async () => {
    const { render } = prepareRender();

    render({ tComponentProps: { keyName: 'hello' } });
    await waitFor(() => {
      const translated = screen.getByText('translated');
      expect(translated.getAttribute('data-tolgee-key-only')).toEqual('hello');
    });
  });

  describe('with all strategies', function () {
    ['NO_WRAP', 'ELEMENT_WRAP'].forEach((strategy) => {
      describe(`strategy ${strategy}`, () => {
        test('calls translate function when language is changed', async () => {
          const renderrer = prepareRender();
          renderrer.render({
            tComponentProps: { strategy: strategy as any, keyName: 'hello' },
          });
          await waitFor(() => {
            screen.getAllByText('translated');
          });
          renderrer.subscriptionCallbacks.onLangChange();
          renderrer.subscriptionCallbacks.onLangChange();
          renderrer.subscriptionCallbacks.onLangChange();
          expect(renderrer.translateMock).toBeCalledTimes(4);
        });

        test('cleans the subscription', () => {
          const renderrer = prepareRender();
          const { unmount } = renderrer.render({
            tComponentProps: { strategy, keyName: 'hello' },
          });
          unmount();
          expect(renderrer.onTranslationChangeUnsubscribeMock).toBeCalledTimes(
            1
          );
        });
      });
    });
  });

  describe('with NO_WRAP and ELEMENT_WRAP', function () {
    ['NO_WRAP', 'ELEMENT_WRAP'].forEach((strategy) => {
      describe(`strategy ${strategy}`, () => {
        test('calls translate function when language is changed', () => {
          const renderrer = prepareRender();
          renderrer.render({ tComponentProps: { strategy, keyName: 'hello' } });
          renderrer.subscriptionCallbacks.onTranslationChange({ key: 'hello' });
          renderrer.subscriptionCallbacks.onTranslationChange({ key: 'hello' });
          renderrer.subscriptionCallbacks.onTranslationChange({
            key: 'not hello',
          });
          expect(renderrer.translateMock).toBeCalledTimes(4);
        });

        test('cleans the subscription', () => {
          const renderrer = prepareRender();

          const { unmount } = renderrer.render({
            tComponentProps: { strategy, keyName: 'hello' },
          });
          unmount();
          expect(renderrer.onLangChangeUnsubscribeMock).toBeCalledTimes(1);
        });
      });
    });
  });

  describe('with NO_WRAP strategy', () => {
    let translated;
    let renderrer: ReturnType<typeof prepareRender>;

    beforeEach(async () => {
      renderrer = prepareRender();

      renderrer.render({
        tComponentProps: { strategy: 'NO_WRAP', keyName: 'hello' },
      });

      await waitFor(() => {
        translated = screen.getByText('translated');
      });
    });

    test('translate fn is called with proper params', async () => {
      expect(renderrer.translateMock).toBeCalledWith({
        orEmpty: true,
        key: 'hello',
        noWrap: true,
        params: undefined,
      });
    });

    test('it is not wrapped by span with data attribute', async () => {
      expect(translated.getAttribute('data-tolgee-key-only')).toEqual(null);
    });
  });

  describe('with ELEMENT_WRAP strategy', () => {
    let translated;
    let renderrer: ReturnType<typeof prepareRender>;

    beforeEach(async () => {
      renderrer = prepareRender();

      renderrer.render({
        tComponentProps: { strategy: 'ELEMENT_WRAP', keyName: 'example-key' },
        content: 'hello',
      });
      await waitFor(() => {
        translated = screen.getByText('translated');
      });
    });

    test('instant fn is called at first', async () => {
      expect(renderrer.instantMock).toBeCalledTimes(1);
    });

    test('translate fn is called', async () => {
      expect(renderrer.translateMock).toBeCalledTimes(1);
    });

    test('translate fn is called with proper params', async () => {
      expect(renderrer.translateMock).toBeCalledWith({
        orEmpty: true,
        key: 'example-key',
        noWrap: true,
        params: undefined,
      });
    });

    test('it is wrapped by span with data attribute', async () => {
      expect(translated.getAttribute('data-tolgee-key-only')).toEqual(
        'example-key'
      );
    });
  });

  describe('works fine with keyName prop and default value as children', () => {
    let renderrer: ReturnType<typeof prepareRender>;
    beforeEach(async () => {
      renderrer = prepareRender();

      renderrer.render({
        tComponentProps: { keyName: 'what a key' },
        content: 'hello',
      });
      await waitFor(() => {
        screen.getByText('translated');
      });
    });

    test('instant fn is called with proper params', async () => {
      expect(renderrer.instantMock).toBeCalledWith({
        key: 'what a key',
        noWrap: true,
        orEmpty: true,
        params: undefined,
      });
    });

    test('translate fn is called with proper params', async () => {
      expect(renderrer.translateMock).toBeCalledWith({
        orEmpty: true,
        key: 'what a key',
        noWrap: true,
        params: undefined,
      });
    });
  });
});
