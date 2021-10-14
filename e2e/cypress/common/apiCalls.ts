import { PASSWORD, USERNAME, API_URL } from './constants';
import { ArgumentTypes, Scope } from './types';

let token = null;

const v2apiFetch = (
  input: string,
  init?: ArgumentTypes<typeof cy.request>[0],
  headers = {}
) => {
  return cy.request({
    url: API_URL + '/v2/' + input,
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + token,
      ...headers,
    },
    ...init,
  });
};

export const login = (username = USERNAME, password = PASSWORD) => {
  return cy
    .request({
      url: API_URL + '/api/public/generatetoken',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username,
        password,
      }),
    })
    .then((res) => {
      token = res.body.accessToken;
      window.localStorage.setItem('jwtToken', token);
    });
};

export const createApiKey = (body: { projectId: number; scopes: Scope[] }) =>
  v2apiFetch(`api-keys`, { method: 'POST', body }).then(
    (r) => r.body
  ) as any as Promise<any>;

export const getScreenshots = (projectId: number, keyId: number) =>
  v2apiFetch(`projects/${projectId}/keys/${keyId}/screenshots`).then(
    (r) => r.body
  );

export const deleteScreenshots = (
  projectId: number,
  keyId: number,
  ids: number[]
) =>
  v2apiFetch(
    `projects/${projectId}/keys/${keyId}/screenshots/${ids.join(',')}`,
    { method: 'delete' }
  ).then((r) => r.body);
