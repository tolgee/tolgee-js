import { login } from '../../common/apiCalls';
import { getByAriaLabel } from '../../common/selectors';
import { openUI, visitWithApiKey } from '../../common/nextInternalCommon';
import { getDevUi } from '../../common/devUiTools';

/**
 * Chrome 137 has broken the extension support of cypress
 * https://github.com/cypress-io/cypress/issues/31690
 *
 * Currently solved by running tests in edge in github
 */

context('UI Dialog', () => {
  // `takeScreenshot()` expects a fetchable image URL; generate a regular
  // sized PNG so backend image validation behaves like in production.
  const createMockScreenshotDataUrl = (win: Window) => {
    const canvas = win.document.createElement('canvas');
    canvas.width = 1200;
    canvas.height = 700;
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      throw new Error('Cannot initialize canvas context for screenshot mock');
    }
    ctx.fillStyle = '#1e3a8a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(80, 80, 460, 160);
    return canvas.toDataURL('image/png');
  };

  const mockExtension = () => {
    cy.on('window:before:load', (win) => {
      const originalPostMessage = win.postMessage.bind(win);
      win.postMessage = ((
        message: any,
        targetOrigin: string,
        transfer?: any
      ) => {
        const type = message?.type;
        if (type === 'TOLGEE_PING') {
          setTimeout(() => {
            win.dispatchEvent(
              new win.MessageEvent('message', {
                data: { type: 'TOLGEE_PONG' },
              })
            );
          }, 0);
          return;
        }

        if (type === 'TOLGEE_TAKE_SCREENSHOT') {
          const screenshotData = createMockScreenshotDataUrl(win);
          setTimeout(() => {
            win.dispatchEvent(
              new win.MessageEvent('message', {
                data: {
                  type: 'TOLGEE_SCREENSHOT_TAKEN',
                  data: screenshotData,
                },
              })
            );
          }, 0);
          return;
        }

        originalPostMessage(message, targetOrigin, transfer);
      }) as any;
    });
  };

  beforeEach(() => {
    login();
    mockExtension();
  });

  const takeScreenshotAndWait = () => {
    getByAriaLabel('Take screenshot').should('be.visible').click();
    getByAriaLabel('Screenshot', { timeout: 20000 }).should('be.visible');
  };

  it('makes screenshot', () => {
    visitWithApiKey([
      'translations.view',
      'keys.edit',
      'translations.edit',
      'screenshots.view',
      'screenshots.upload',
    ]);
    openUI();
    takeScreenshotAndWait();
  });

  it('screenshots not editable', () => {
    visitWithApiKey([
      'translations.view',
      'keys.edit',
      'translations.edit',
      'screenshots.view',
    ]);
    openUI();
    getDevUi().contains('There are no screenshots.').should('be.visible');
    getByAriaLabel('Take screenshot').should('not.exist');
  });

  it('screenshots editable', () => {
    visitWithApiKey([
      'translations.view',
      'keys.edit',
      'translations.edit',
      'screenshots.view',
      'screenshots.upload',
    ]);
    openUI();
    getDevUi().contains('There are no screenshots.').should('be.visible');
    takeScreenshotAndWait();
    getByAriaLabel('Screenshot', { timeout: 10000 })
      .should('be.visible')
      .trigger('mouseover');
    // we should be able to delete just uploaded images
    getByAriaLabel('Delete').should('be.visible');

    getDevUi().contains('Update').click();

    openUI();
    getByAriaLabel('Screenshot', { timeout: 10000 })
      .should('be.visible')
      .trigger('mouseover');
    // we can't delete already saved screenshots
    getByAriaLabel('Delete').should('not.exist');
  });

  it('screenshots deletable', () => {
    visitWithApiKey([
      'translations.view',
      'keys.edit',
      'translations.edit',
      'screenshots.view',
      'screenshots.upload',
      'screenshots.delete',
    ]);
    openUI();
    takeScreenshotAndWait();
    getDevUi().contains('Update').click();

    openUI();
    getByAriaLabel('Screenshot', { timeout: 10000 }).trigger('mouseover');
    getByAriaLabel('Delete').should('be.visible').click();
    getDevUi().contains('Update').click();

    openUI();
    getByAriaLabel('Screenshot').should('not.exist');
  });
});
