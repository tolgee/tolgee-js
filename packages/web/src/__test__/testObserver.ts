import { TolgeeCore, TolgeeInstance } from '@tolgee/core';
import { screen, waitFor } from '@testing-library/dom';
import {
  TOLGEE_ATTRIBUTE_NAME,
  TOLGEE_WRAPPED_ONLY_DATA_ATTRIBUTE,
} from '../constants';
import { ObserverPlugin } from '../ObserverPlugin';

export const testObserver = (observerType: 'invisible' | 'text') => {
  describe('observer', () => {
    let tolgee: TolgeeInstance;

    beforeEach(() => {
      tolgee = TolgeeCore()
        .use(ObserverPlugin())
        .init({
          language: 'en',
          staticData: { en: { hello: 'world' } },
          observerType,
        });
    });

    afterEach(() => {
      tolgee.stop();
    });

    it('runs observer', async () => {
      tolgee.run();
      document.body.innerHTML = `
        <span data-testid="translation">${tolgee.t({ key: 'hello' })}</span>
      `;

      await waitFor(() => {
        expect(screen.queryByTestId('translation')?.textContent).toEqual(
          'world'
        );
      });
    });

    it('runs observer', async () => {
      tolgee.run();
      document.body.innerHTML = `
        <span data-testid="translation">${tolgee.t({ key: 'hello' })}</span>
      `;

      await waitFor(() => {
        expect(screen.queryByTestId('translation')?.textContent).toEqual(
          'world'
        );
      });
    });

    it('ignoring works', async () => {
      tolgee.run();
      document.body.innerHTML = `
        <span data-testid="ignoredTranslation" data-tolgee-restricted="true">
          ${tolgee.t({ key: 'hello' })}
          <span data-testid="ignoredInside">${tolgee.t({
            key: 'hello',
          })}</span>  
        </span>
        <span data-testid="translation">${tolgee.t({ key: 'hello' })}</span>
      `;

      await waitFor(() => {
        expect(
          screen
            .queryByTestId('translation')
            ?.getAttribute(TOLGEE_ATTRIBUTE_NAME)
        ).not.toBeFalsy();
        expect(
          screen
            .queryByTestId('ignoredTranslation')
            ?.getAttribute(TOLGEE_ATTRIBUTE_NAME)
        ).toBeFalsy();
        expect(
          screen
            .queryByTestId('ignoredInside')
            ?.getAttribute(TOLGEE_ATTRIBUTE_NAME)
        ).toBeFalsy();
      });
    });

    it('key only attribute', async () => {
      tolgee.run();
      document.body.innerHTML = `
        <span data-testid="translation" ${TOLGEE_WRAPPED_ONLY_DATA_ATTRIBUTE}="hello">Hello</span>
      `;

      await waitFor(() => {
        expect(
          screen
            .queryByTestId('translation')
            ?.getAttribute(TOLGEE_ATTRIBUTE_NAME)
        ).not.toBeFalsy();
      });

      screen
        .queryByTestId('translation')!
        .removeAttribute(TOLGEE_WRAPPED_ONLY_DATA_ATTRIBUTE);

      await waitFor(() => {
        expect(
          screen
            .queryByTestId('translation')
            ?.getAttribute(TOLGEE_ATTRIBUTE_NAME)
        ).toBeFalsy();
      });
    });
  });
};
