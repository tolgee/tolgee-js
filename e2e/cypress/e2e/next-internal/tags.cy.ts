import { login } from '../../common/apiCalls';
import { openUI, visitWithApiKey } from '../../common/nextInternalCommon';
import { getDevUi } from '../../common/devUiTools';

context('Tags editing', () => {
  beforeEach(() => {
    login();
  });

  it('can add tag', () => {
    visitWithApiKey([
      'translations.view',
      'keys.edit',
      'translations.edit',
      'screenshots.view',
      'screenshots.upload',
    ]);
    openUI();
    cy.intercept({ path: '/v2/projects/*/tags**', method: 'get' }).as(
      'getTags'
    );
    cy.intercept({ path: '/v2/projects/*/keys/**', method: 'put' }, (req) => {
      req.reply({
        body: {
          id: 1000000706,
          name: 'app-title',
          translations: {
            de: { id: 1000000806, text: 'Was mitnehmen', state: 'TRANSLATED' },
            en: { id: 1000000817, text: 'Hello world', state: 'TRANSLATED' },
            fr: { id: 1000000828, text: 'Quoi emballer', state: 'TRANSLATED' },
            cs: { id: 1000000839, text: 'Co sbalit', state: 'TRANSLATED' },
          },
          tags: [],
          screenshots: [],
        },
      });
    }).as('updateTranslation');

    cy.wait(1000);

    getDevUi()
      .findDcy('tag-autocomplete-input')
      .should('be.visible')
      .click()
      .type('test-tag');

    cy.wait('@getTags');

    getDevUi().findDcy('tag-autocomplete-option').contains('test-tag').click();

    getDevUi().contains('Update').click();

    cy.wait('@updateTranslation').then(({ request }) => {
      expect(request.body.tags).to.deep.eq(['test-tag']);
    });
  });

  it("can't edit witout permission", () => {
    visitWithApiKey(['translations.view']);
    openUI();
    getDevUi().findDcy('tag-autocomplete-input').should('not.exist');
  });
});
