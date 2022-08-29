import { InvisibleWrapper } from '../observers/invisible/InvisibleWrapper';
import { Tolgee } from '../Tolgee';
import { screen } from '@testing-library/dom';
import { InvisibleObserver } from '../observers/InvisibleObserver';
import { TolgeeInstance } from '../types';

describe('observer', () => {
  let tolgee: TolgeeInstance;

  it('runs observer', async () => {
    tolgee = Tolgee({
      language: 'en',
      staticData: { en: { hello: 'world' } },
    }).setObserver(InvisibleObserver());

    tolgee.run();

    document.body.innerHTML = `
      <span data-testid="translation">${tolgee.instant('hello')}</span>
    `;

    expect(screen.queryByTestId('translation')?.textContent).toContain('world');

    tolgee.stop();
  });

  afterEach(() => {
    tolgee.stop();
  });
});
