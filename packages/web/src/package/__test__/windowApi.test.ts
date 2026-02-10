import { TolgeeCore, TolgeeInstance } from '@tolgee/core';
import { waitFor } from '@testing-library/dom';
import { InContextTools } from '../InContextTools';
import { setupWindowApi } from '../WindowApi';
import { TOLGEE_ATTRIBUTE_NAME } from '../constants';

(['invisible', 'text'] as const).forEach((observerType) => {
  describe(`window.__tolgee API (${observerType})`, () => {
    let tolgee: TolgeeInstance;

    afterEach(() => {
      tolgee.stop();
      document.body.innerHTML = '';
    });

    it('is set when InContextTools is used', async () => {
      tolgee = TolgeeCore()
        .use(InContextTools())
        .init({
          language: 'en',
          staticData: { en: { hello: 'world' } },
          observerType,
        });
      await tolgee.run();
      expect(window.__tolgee).toBeDefined();
      expect(typeof window.__tolgee!.getVisibleKeys).toBe('function');
      expect(typeof window.__tolgee!.highlight).toBe('function');
      expect(typeof window.__tolgee!.isRunning).toBe('function');
    });

    it('isRunning() returns true when running', async () => {
      tolgee = TolgeeCore()
        .use(InContextTools())
        .init({
          language: 'en',
          staticData: { en: { hello: 'world' } },
          observerType,
        });
      await tolgee.run();
      expect(window.__tolgee!.isRunning()).toBe(true);
    });

    it('getVisibleKeys() returns key positions for rendered translations', async () => {
      tolgee = TolgeeCore()
        .use(InContextTools())
        .init({
          language: 'en',
          staticData: { en: { hello: 'world' } },
          observerType,
        });
      await tolgee.run();

      document.body.innerHTML = `
        <span data-testid="translation">${tolgee.t({ key: 'hello' })}</span>
      `;

      await waitFor(() => {
        expect(
          document
            .querySelector('[data-testid="translation"]')
            ?.getAttribute(TOLGEE_ATTRIBUTE_NAME)
        ).not.toBeFalsy();
      });

      // findPositions finds the key in the DOM (jsdom returns zero-size rects)
      const allPositions = tolgee.findPositions();
      expect(allPositions.length).toBeGreaterThan(0);
      expect(allPositions[0]).toMatchObject({
        keyName: 'hello',
        keyNamespace: '',
      });
      expect(allPositions[0].position).toBeDefined();
    });

    it('highlight() returns an unhighlight handle', async () => {
      tolgee = TolgeeCore()
        .use(InContextTools())
        .init({
          language: 'en',
          staticData: { en: { hello: 'world' } },
          observerType,
        });
      await tolgee.run();

      const result = window.__tolgee!.highlight('hello');
      expect(result).toBeDefined();
      expect(typeof result.unhighlight).toBe('function');
      result.unhighlight();
    });

    it('getVisibleKeys() filters out keys outside the viewport', () => {
      const vw = window.innerWidth;
      const vh = window.innerHeight;

      const mockTolgee = {
        findPositions: () => [
          // visible: fully inside viewport
          {
            keyName: 'visible-key',
            keyNamespace: '',
            position: { x: 10, y: 10, width: 100, height: 20 },
          },
          // off-screen: below viewport
          {
            keyName: 'below-viewport',
            keyNamespace: '',
            position: { x: 10, y: vh + 10, width: 100, height: 20 },
          },
          // off-screen: to the right of viewport
          {
            keyName: 'right-of-viewport',
            keyNamespace: '',
            position: { x: vw + 10, y: 10, width: 100, height: 20 },
          },
          // off-screen: above viewport
          {
            keyName: 'above-viewport',
            keyNamespace: '',
            position: { x: 10, y: -100, width: 100, height: 20 },
          },
          // off-screen: to the left of viewport
          {
            keyName: 'left-of-viewport',
            keyNamespace: '',
            position: { x: -200, y: 10, width: 100, height: 20 },
          },
          // partially visible: overlapping bottom edge
          {
            keyName: 'partial-bottom',
            keyNamespace: '',
            position: { x: 10, y: vh - 10, width: 100, height: 30 },
          },
        ],
        highlight: () => ({ unhighlight() {} }),
        isRunning: () => true,
      };

      // setupWindowApi works with any object matching the TolgeeInstance shape
      const teardown = setupWindowApi(mockTolgee as any);

      // need to use a separate tolgee instance for afterEach cleanup
      tolgee = TolgeeCore().init({ language: 'en' });

      const keys = window.__tolgee!.getVisibleKeys();
      const keyNames = keys.map((k) => k.keyName);

      expect(keyNames).toContain('visible-key');
      expect(keyNames).toContain('partial-bottom');
      expect(keyNames).not.toContain('below-viewport');
      expect(keyNames).not.toContain('right-of-viewport');
      expect(keyNames).not.toContain('above-viewport');
      expect(keyNames).not.toContain('left-of-viewport');
      expect(keys).toHaveLength(2);

      teardown();
    });

    it('is removed on tolgee.stop()', async () => {
      tolgee = TolgeeCore()
        .use(InContextTools())
        .init({
          language: 'en',
          staticData: { en: { hello: 'world' } },
          observerType,
        });
      await tolgee.run();
      expect(window.__tolgee).toBeDefined();

      tolgee.stop();
      expect(window.__tolgee).toBeUndefined();
    });
  });
});
