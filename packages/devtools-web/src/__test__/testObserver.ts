import {
  Tolgee,
  TolgeeInstance,
  TOLGEE_ATTRIBUTE_NAME,
  TOLGEE_WRAPPED_ONLY_DATA_ATTRIBUTE,
} from '@tolgee/core';
import { screen, waitFor } from '@testing-library/dom';
import { ObserverPlugin } from '@tolgee/core';

export const testObserver = (observer: ObserverPlugin) => {
  describe('observer', () => {
    let tolgee: TolgeeInstance;

    beforeEach(() => {
      tolgee = Tolgee()
        .setObserver(observer)
        .init({
          language: 'en',
          staticData: { en: { hello: 'world' } },
        });
      tolgee.run();
    });

    afterEach(() => {
      tolgee.stop();
    });

    it('runs observer', async () => {
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
      document.body.innerHTML = `
      <span data-testid="ignoredTranslation" data-tolgee-restricted="true">
        ${tolgee.t({ key: 'hello' })}
        <span data-testid="ignoredInside">${tolgee.t({ key: 'hello' })}</span>  
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
