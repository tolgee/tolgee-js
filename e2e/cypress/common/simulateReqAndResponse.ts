import { components } from '../../../packages/web/src/package/ui/client/apiSchema.generated';
import { getDevUi } from './devUiTools';
import { openUI, visitWithApiKey } from './nextInternalCommon';
import testLanguages from './testLanguages';

export type ApiKeyPermissionsModel =
  components['schemas']['ApiKeyPermissionsModel'];
export type ComplexEditKeyDto = components['schemas']['ComplexEditKeyDto'];

type Props = {
  permissions: ApiKeyPermissionsModel;
  inForm: () => void;
  checkRequest?: (data: ComplexEditKeyDto) => void;
  checkPage?: () => void;
  language?: string;
  translation?: string;
  selectedLanguages?: string[];
};

export const simulateReqAndResponse = ({
  permissions,
  inForm,
  checkRequest,
  checkPage,
  language,
  translation,
  selectedLanguages,
}: Props) => {
  const randomId = String(Math.random());
  // simulating restricted languages in api key info (english only)
  cy.intercept(
    { path: '/v2/api-keys/current-permissions', method: 'get' },
    (req) => {
      req.reply(permissions);
    }
  );
  cy.intercept({ path: '/v2/projects/*/languages**', method: 'get' }, (req) => {
    req.reply(testLanguages);
  });
  visitWithApiKey(permissions.scopes as any, selectedLanguages);

  if (language) {
    cy.get('.lang-selector').select('Česky');
  }
  openUI(translation);
  inForm();
  cy.intercept({ path: '/v2/projects/*/keys/**', method: 'put' }, (req) => {
    checkRequest?.(req.body);
    // response is not checked by the client
    req.reply({ response: 'success' });
  }).as(randomId);

  getDevUi().findDcy('key-form-submit').click();
  return cy.wait(`@${randomId}`).then(() => {
    checkPage?.();
  });
};
