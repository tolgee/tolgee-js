jest.dontMock('./mocks/MixinComponent.vue');
jest.dontMock('./mocks/MixinComponent2.vue');
jest.dontMock('./mocks/mockTolgee');
jest.dontMock('./TolgeeMixin');

jest.mock('@tolgee/core');

import { render, screen, waitFor } from '@testing-library/vue';
import { Tolgee } from '@tolgee/core';
import { mockTolgee } from './mocks/mockTolgee';
import { TolgeeContext } from './types';
import MixinComponent from './mocks/MixinComponent.vue';
import MixinComponent2 from './mocks/MixinComponent2.vue';
import { TolgeeMixin } from './TolgeeMixin';

let translatedValue;

export const prepareRender = () => {
  const tolgeeMock = mockTolgee();
  const tolgeeContext: TolgeeContext = {
    tolgee: tolgeeMock.tolgee as Tolgee,
  };

  return {
    ...tolgeeMock,
    render: (opts: {
      component: any;
      content?: string;
      tComponentProps?: Record<string, unknown>;
    }) =>
      render(opts.component, {
        props: {
          ...opts?.tComponentProps,
        },
        global: {
          provide: {
            tolgeeContext,
          },
          mixins: [TolgeeMixin],
        },
      }),
  };
};

describe('TolgeeMixin', function () {
  describe('basics', () => {
    let elements;
    let renderer: ReturnType<typeof prepareRender>;

    beforeEach(async () => {
      jest.clearAllMocks();
      translatedValue = 'translated';
      renderer = prepareRender();
      renderer.render({
        component: MixinComponent,
      });
      await waitFor(() => {
        elements = screen.getAllByText('translated');
      });
    });

    test('proper result is rendered', () => {
      expect(elements).toHaveLength(3);
    });

    test('calls instant function', async () => {
      expect(renderer.instantMock).toBeCalledTimes(3);
    });

    test('calls instant function with proper params', async () => {
      expect(renderer.instantMock).toHaveBeenCalledWith({
        defaultValue: undefined,
        key: 'hello',
        noWrap: undefined,
        params: undefined,
      });
      expect(renderer.instantMock).toHaveBeenCalledWith({
        defaultValue: undefined,
        key: 'hello2',
        noWrap: undefined,
        params: { name: 'test' },
      });
      expect(renderer.instantMock).toHaveBeenCalledWith({
        defaultValue: 'Default',
        key: 'hello3',
        noWrap: true,
        params: undefined,
      });
    });

    test('calls translate function with proper params', async () => {
      expect(renderer.translateMock).toHaveBeenCalledWith({
        defaultValue: undefined,
        key: 'hello',
        noWrap: undefined,
        params: undefined,
      });
      expect(renderer.translateMock).toHaveBeenCalledWith({
        defaultValue: undefined,
        key: 'hello2',
        noWrap: undefined,
        params: { name: 'test' },
      });
      expect(renderer.translateMock).toHaveBeenCalledWith({
        defaultValue: 'Default',
        key: 'hello3',
        noWrap: true,
        params: undefined,
      });
    });

    test('listens to language change', async () => {
      jest.clearAllMocks();
      const newTranslatedValue = 'translated in new lang';
      renderer.changeTranslationValue(newTranslatedValue);
      await waitFor(() => {
        elements = screen.getAllByText(translatedValue);
      });
      renderer.subscriptionCallbacks.onLangChange();
      await waitFor(() => {
        elements = screen.getAllByText(newTranslatedValue);
      });
      // Mixin calls translate only once and then causes forceUptdate
      // which gets new translations from cache
      expect(renderer.translateMock).toBeCalledTimes(1);
      expect(renderer.instantMock).toBeCalledTimes(3);
      expect(elements).toHaveLength(3);
      expect(renderer.instantMock).toHaveBeenCalledWith({
        key: 'hello3',
        params: undefined,
        noWrap: true,
        defaultValue: 'Default',
      });
    });

    test('listens to translation change', async () => {
      jest.clearAllMocks();
      const newTranslatedValue = 'translated changed';
      renderer.changeTranslationValue(newTranslatedValue);
      // this causes forceUpdate, so we expect all translations to be new
      renderer.subscriptionCallbacks.onTranslationChange({ key: 'hello2' });
      await waitFor(() => {
        elements = screen.getAllByText(newTranslatedValue);
      });
      expect(renderer.instantMock).toBeCalledTimes(3);
      expect(elements).toHaveLength(3);
      expect(renderer.instantMock).toHaveBeenCalledWith({
        defaultValue: undefined,
        key: 'hello2',
        noWrap: undefined,
        params: { name: 'test' },
      });
    });
  });

  describe('object params', () => {
    let renderrer: ReturnType<typeof prepareRender>;
    beforeEach(async () => {
      jest.clearAllMocks();
      translatedValue = 'translated';
      renderrer = prepareRender();
      renderrer.render({ component: MixinComponent2 });
      await waitFor(() => {
        screen.getByText('translated');
      });
    });

    test('calls instant function', async () => {
      expect(renderrer.instantMock).toBeCalledTimes(1);
    });

    test('calls instant function with proper params', async () => {
      expect(renderrer.instantMock).toHaveBeenCalledWith({
        defaultValue: 'Default',
        key: 'hello',
        noWrap: false,
        params: { name: 'test' },
      });
    });

    test('calls translate function with proper params', async () => {
      expect(renderrer.translateMock).toHaveBeenCalledWith({
        defaultValue: 'Default',
        key: 'hello',
        noWrap: false,
        params: { name: 'test' },
      });
    });
  });
});
