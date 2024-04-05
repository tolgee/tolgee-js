import { waitFor, screen } from '@testing-library/dom';
import { TolgeeCore, TolgeeInstance } from '@tolgee/core';
import { TOLGEE_ATTRIBUTE_NAME } from '../constants';
import { InContextTools } from '../InContextTools';

(['invisible', 'text'] as const).forEach((observerType) => {
  describe(`observer ${observerType}`, () => {
    const MyTolgee = () =>
      TolgeeCore()
        .use(InContextTools())
        .updateDefaults({
          language: 'en',
          staticData: { en: { test: 'Hello world' } },
          observerType,
        });

    let tolgee: TolgeeInstance;

    afterEach(() => {
      tolgee.stop();
    });

    it('pass to parent', async () => {
      tolgee = MyTolgee().init({ observerOptions: { passToParent: ['b'] } });
      await tolgee.run();
      document.body.innerHTML = `
        <div data-testid="parent">
          <b>${tolgee.t('test')}</b>
        </div>
      `;
      await waitFor(() => {
        const element = screen.queryByTestId('parent');
        expect(element?.getAttribute(TOLGEE_ATTRIBUTE_NAME)).not.toBeFalsy();
      });
    });

    it('pass to parent function', async () => {
      tolgee = MyTolgee().init({
        observerOptions: {
          passToParent: (e) => e.tagName.toLowerCase() === 'b',
        },
      });

      await tolgee.run();
      document.body.innerHTML = `
        <div data-testid="parent">
          <b>${tolgee.t('test')}</b>
          <i data-testid="child-i">${tolgee.t('test')}</i>
        </div>
      `;
      await waitFor(() => {
        expect(
          screen.queryByTestId('parent')?.getAttribute(TOLGEE_ATTRIBUTE_NAME)
        ).not.toBeFalsy();

        expect(
          screen.queryByTestId('child-i')?.getAttribute(TOLGEE_ATTRIBUTE_NAME)
        ).not.toBeFalsy();
      });
    });

    it('restricted elements', async () => {
      tolgee = MyTolgee().init({
        observerOptions: {
          restrictedElements: ['main'],
        },
      });

      await tolgee.run();
      document.body.innerHTML = `
        <div data-testid="parent">
          <main data-testid="ignored">${tolgee.t('test')}</main>
          <div data-testid="normal">${tolgee.t('test')}</div>
        </div>
      `;
      await waitFor(() => {
        const ignored = screen.queryByTestId('ignored');
        expect(ignored?.getAttribute(TOLGEE_ATTRIBUTE_NAME)).toBeFalsy();

        const normal = screen.queryByTestId('normal');
        expect(normal?.getAttribute(TOLGEE_ATTRIBUTE_NAME)).not.toBeFalsy();
      });
    });

    it('tag attributes', async () => {
      tolgee = MyTolgee().init({
        observerOptions: {
          tagAttributes: {
            main: ['test'],
            '*': ['title'],
          },
        },
      });

      await tolgee.run();
      document.body.innerHTML = `
        <div>
          <main data-testid="main-foo" foo="${tolgee.t('test')}"></main>
          <main data-testid="main-test" test="${tolgee.t('test')}"></main>
          <main data-testid="main-title" title="${tolgee.t('test')}"></main>
          <div data-testid="div-test" test="${tolgee.t('test')}"></div>
          <div data-testid="div-title" title="${tolgee.t('test')}"></div>
        </div>
      `;
      await waitFor(() => {
        expect(
          screen.queryByTestId('main-foo')?.getAttribute(TOLGEE_ATTRIBUTE_NAME)
        ).toBeFalsy();
        expect(
          screen.queryByTestId('main-test')?.getAttribute(TOLGEE_ATTRIBUTE_NAME)
        ).not.toBeFalsy();
        expect(
          screen
            .queryByTestId('main-title')
            ?.getAttribute(TOLGEE_ATTRIBUTE_NAME)
        ).not.toBeFalsy();
        expect(
          screen.queryByTestId('div-test')?.getAttribute(TOLGEE_ATTRIBUTE_NAME)
        ).toBeFalsy();
        expect(
          screen.queryByTestId('div-title')?.getAttribute(TOLGEE_ATTRIBUTE_NAME)
        ).not.toBeFalsy();
      });
    });
  });
});
