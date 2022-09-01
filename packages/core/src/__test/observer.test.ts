import { Tolgee } from '../Tolgee';
import { screen, waitFor } from '@testing-library/dom';
import { InvisibleObserver } from '../observers/InvisibleObserver';
import { TolgeeInstance } from '../types';
import { TextObserver } from '../observers/TextObserver';

describe('observer', () => {
  let tolgee: TolgeeInstance;

  it('runs observer', async () => {
    tolgee = Tolgee({
      language: 'en',
      staticData: { en: { hello: 'world' } },
    }).setObserver(InvisibleObserver());

    tolgee.run();

    document.body.innerHTML = `
      <span data-testid="translation">${tolgee.instant({ key: 'hello' })}</span>
    `;

    waitFor(() => {
      expect(screen.queryByTestId('translation')?.textContent).toEqual('world');
    });

    tolgee.stop();
  });

  it('runs observer', async () => {
    tolgee = Tolgee({
      language: 'en',
      staticData: { en: { hello: 'world' } },
    }).setObserver(TextObserver());

    tolgee.run();

    document.body.innerHTML = `
      <span data-testid="translation">${tolgee.instant({ key: 'hello' })}</span>
    `;

    waitFor(() => {
      expect(screen.queryByTestId('translation')?.textContent).toEqual('world');
    });

    tolgee.stop();
  });

  afterEach(() => {
    tolgee.stop();
  });
});
