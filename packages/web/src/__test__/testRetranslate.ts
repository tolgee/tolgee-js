import { screen, waitFor } from '@testing-library/dom';
import { TolgeeCore, TolgeeInstance } from '@tolgee/core';
import { TOLGEE_ATTRIBUTE_NAME } from '../constants';
import { ObserverPlugin } from '../ObserverPlugin';

export const testRetranslate = (observerType: 'invisible' | 'text') => {
  describe('retranslate', () => {
    let tolgee: TolgeeInstance;

    beforeEach(async () => {
      tolgee = TolgeeCore()
        .use(ObserverPlugin())
        .init({
          language: 'en',
          staticData: { en: { hello: 'world' }, es: { hello: 'mundo' } },
          observerType,
        });
      await tolgee.run();
    });

    afterEach(() => {
      tolgee.stop();
    });

    it('change translation on language change', async () => {
      document.body.innerHTML = `
      <span data-testid="translation">${tolgee.t({ key: 'hello' })}</span>
    `;

      await waitFor(() => {
        const element = screen.queryByTestId('translation');
        expect(element?.textContent).toEqual('world');
        expect(element?.getAttribute(TOLGEE_ATTRIBUTE_NAME)).not.toBeFalsy();
      });

      await tolgee.changeLanguage('es');

      await waitFor(() => {
        expect(screen.queryByTestId('translation')?.textContent).toEqual(
          'mundo'
        );
      });
    });
  });
};
