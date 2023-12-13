import { components } from '../../../packages/web/src/ui/client/apiSchema.generated';
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
};

export const simulateReqAndResponse = ({
  permissions,
  inForm,
  checkRequest,
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
  visitWithApiKey(permissions.scopes as any);
  openUI();
  inForm();
  cy.intercept({ path: '/v2/projects/*/keys/**', method: 'put' }, (req) => {
    checkRequest?.(req.body);
    // response is not checked by the client
    req.reply({});
  }).as(randomId);

  getDevUi().contains('Update').click();
  return cy.wait(`@${randomId}`);
};
