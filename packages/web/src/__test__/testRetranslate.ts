import { screen, waitFor } from '@testing-library/dom';
import { Tolgee, TolgeeInstance, TolgeePlugin } from '@tolgee/core';
import { TOLGEE_ATTRIBUTE_NAME } from '../constants';

export const testRetranslate = (plugin: TolgeePlugin) => {
  describe('retranslate', () => {
    let tolgee: TolgeeInstance;

    beforeEach(async () => {
      tolgee = Tolgee()
        .use(plugin)
        .init({
          language: 'en',
          staticData: { en: { hello: 'world' }, es: { hello: 'mundo' } },
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
