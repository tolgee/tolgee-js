import { TolgeeCore, TolgeeInstance } from '@tolgee/core';
import { fireEvent, screen, waitFor } from '@testing-library/dom';
import {
  TOLGEE_ATTRIBUTE_NAME,
  TOLGEE_HIGHLIGHTER_CLASS,
  TOLGEE_WRAPPED_ONLY_DATA_ATTRIBUTE,
} from '../constants';
import { ContextUi } from '../ContextUi';
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

    it("doesn't show highlight when there is no UI", async () => {
      tolgee.run();
      document.body.innerHTML = `
        <span data-testid="translation">${tolgee.t({ key: 'hello' })}</span>
      `;

      await waitFor(() => {
        expect(
          screen
            .queryByTestId('translation')
            ?.getAttribute(TOLGEE_ATTRIBUTE_NAME)
        ).not.toBeFalsy();
      });

      const element = screen.queryByTestId('translation');

      document.elementsFromPoint = jest.fn(() => [element]);

      fireEvent(
        element,
        new MouseEvent('mousemove', {
          altKey: true,
          clientX: element.clientLeft,
          clientY: element.clientTop,
        })
      );

      await waitFor(() => {
        expect(
          document.querySelector(`.${TOLGEE_HIGHLIGHTER_CLASS}`)
        ).toBeNull();
      });
    });

    it('show highlight when there is UI', async () => {
      // adding ui plugin
      tolgee.addPlugin(ContextUi());
      tolgee.run();
      document.body.innerHTML = `
        <span data-testid="translation">${tolgee.t({ key: 'hello' })}</span>
      `;

      await waitFor(() => {
        expect(
          screen
            .queryByTestId('translation')
            ?.getAttribute(TOLGEE_ATTRIBUTE_NAME)
        ).not.toBeFalsy();
      });

      const element = screen.queryByTestId('translation');

      document.elementsFromPoint = jest.fn(() => [element]);

      fireEvent(
        element,
        new MouseEvent('mousemove', {
          altKey: true,
          clientX: element.clientLeft,
          clientY: element.clientTop,
        })
      );

      await waitFor(() => {
        expect(
          document.querySelector(`.${TOLGEE_HIGHLIGHTER_CLASS}`)
        ).not.toBeNull();
      });
    });
  });
};
