import { render } from '@testing-library/svelte';
import '@testing-library/jest-dom';
import { default as ContextText } from './__testUtil/ContextTest.svelte';
import { T } from '$lib/index';
import type { Tolgee } from '@tolgee/core';
import { mockTolgee } from '$lib/__testUtil/mockTolgee';

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const prepareRender = () => {
  const tolgeeMock = mockTolgee();

  return {
    ...tolgeeMock,
    render: (opts?: { tComponentProps?: Record<string, unknown> }) =>
      render(ContextText, {
        props: {
          Component: T,
          componentProps: {
            keyName: 'key-name',
            ...opts?.tComponentProps,
          },
          contexts: {
            tolgeeContext: {
              tolgee: tolgeeMock.tolgee,
            } as Partial<Tolgee>,
          },
        },
      }),
  };
};

describe('T component', () => {
  it('translates', () => {
    const { render, translateMock, instantMock } = prepareRender();

    const { getByText } = render();

    expect(instantMock).toHaveBeenCalledTimes(1);
    expect(translateMock).toHaveBeenCalledTimes(1);

    expect(getByText('translated')).toBeInTheDocument();
  });

  it('keeps default when provided', () => {
    const { render, translateMock } = prepareRender();
    const { getByText } = render({
      tComponentProps: { defaultValue: 'This is default' },
    });
    expect(getByText('translated')).toBeInTheDocument();
    expect(translateMock).toHaveBeenCalled();
  });

  it('subscribes to translation change', () => {
    const {
      render,
      onTranslationChangeMock,
      subscriptionCallbacks,
      translateMock,
    } = prepareRender();

    render();

    expect(onTranslationChangeMock.subscribe).toHaveBeenCalledTimes(1);
    expect(onTranslationChangeMock.subscribe).toHaveBeenCalledWith(
      subscriptionCallbacks.onTranslationChange
    );
    expect(translateMock).toHaveBeenCalledTimes(1);

    // 1 for initial + 1 call for the actual translationChange
    subscriptionCallbacks.onTranslationChange({ key: 'key-name' });
    expect(translateMock).toHaveBeenCalledTimes(2);

    // 2 for initial + 2 call for the actual translationChange
    subscriptionCallbacks.onTranslationChange({ key: 'key-name' });
    expect(translateMock).toHaveBeenCalledTimes(3);

    // It should not react when key is different
    subscriptionCallbacks.onTranslationChange({ key: 'other-key-name' });
    expect(translateMock).toHaveBeenCalledTimes(3);
  });

  it('unsubscribes for translation change', () => {
    const { render, onTranslationChangeUnsubscribeMock } = prepareRender();

    const { unmount } = render();

    expect(onTranslationChangeUnsubscribeMock).toHaveBeenCalledTimes(0);
    unmount();
    expect(onTranslationChangeUnsubscribeMock).toHaveBeenCalledTimes(1);
  });

  it('subscribes to lang change', () => {
    const { render, onLangChangeMock, subscriptionCallbacks, translateMock } =
      prepareRender();
    render();
    expect(onLangChangeMock.subscribe).toHaveBeenCalledTimes(1);
    expect(onLangChangeMock.subscribe).toHaveBeenCalledWith(
      subscriptionCallbacks.onLangChange
    );

    expect(translateMock).toHaveBeenCalledTimes(1);
    // 1 for initial + 1 call for the actual translationChange
    subscriptionCallbacks.onLangChange();
    expect(translateMock).toHaveBeenCalledTimes(2);
  });

  it('unsubscribes for lang change', () => {
    const { render, onLangChangeUnsubscribeMock } = prepareRender();

    const { unmount } = render();

    expect(onLangChangeUnsubscribeMock).toHaveBeenCalledTimes(0);
    unmount();
    expect(onLangChangeUnsubscribeMock).toHaveBeenCalledTimes(1);
  });

  it('Throws error on missing key name ', async () => {
    const { render } = prepareRender();
    console.error = jest.fn();
    render({
      tComponentProps: { keyName: '' },
    });
    expect(console.error).toHaveBeenCalledWith('Missing keyName prop!');
  });
});
