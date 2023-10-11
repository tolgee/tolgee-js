import { getDevUi } from './devUiTools';

type Options = {
  noLoading: boolean;
};

export const exampleAppDevTest = (url: string, options?: Options) =>
  describe('standard example app dev test', () => {
    beforeEach(() => {
      cy.visit(url);
    });

    if (!options?.noLoading) {
      it('Shows loading on visit', () => {
        cy.contains('Loading...').should('be.visible');
        cy.contains('What To Pack').should('be.visible');
      });
    }

    it('title can be translated', () => {
      cy.contains('What To Pack').invoke('attr', '_tolgee').should('exist');
      cy.contains('What To Pack').trigger('keydown', { key: 'Alt' }).click();
      getDevUi()
        .contains('Quick translation', { timeout: 60 * 1000 })
        .should('be.visible');
    });

    it('placeholder can be translated', () => {
      cy.contains('What To Pack').invoke('attr', '_tolgee').should('exist');
      cy.get('input').trigger('keydown', { key: 'Alt' }).click();
      getDevUi()
        .contains('Quick translation', { timeout: 60 * 1000 })
        .should('be.visible');
    });
  });
