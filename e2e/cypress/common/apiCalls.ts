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

const internalFetch = (
  input: string,
  init?: ArgumentTypes<typeof cy.request>[0]
) => {
  return cy.request({
    url: API_URL + '/internal/' + input,
    headers: {
      'Content-Type': 'application/json',
    },
    ...init,
  });
};

export const setFeature = (feature: string, enabled: boolean) => {
  internalFetch(`features/toggle?feature=${feature}&enabled=${enabled}`, {
    method: 'put',
    failOnStatusCode: false,
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

export const getDefaultBranch = (projectId: number) =>
  v2apiFetch(`projects/${projectId}/branches/find`).then(
    (r) => r.body
  ) as any as Promise<any>;

export const createBranch = (
  projectId: number,
  name: string,
  originBranchId: number
) =>
  v2apiFetch(`projects/${projectId}/branches`, {
    method: 'POST',
    body: { name, originBranchId },
  }).then((r) => r.body) as any as Promise<any>;

export const deleteBranch = (projectId: number, branchId: number) =>
  v2apiFetch(`projects/${projectId}/branches/${branchId}`, {
    method: 'DELETE',
    failOnStatusCode: false,
  });

export const setBranchProtected = (
  projectId: number,
  branchId: number,
  isProtected: boolean
) =>
  v2apiFetch(`projects/${projectId}/branches/${branchId}/protected`, {
    method: 'POST',
    body: { isProtected },
  }).then((r) => r.body) as any as Promise<any>;

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
