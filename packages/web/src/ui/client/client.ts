import { getProjectIdFromApiKey } from '../../tools/decodeApiKey';
import { paths } from './apiSchema.generated';
import { GlobalOptions } from './QueryProvider';
import { RequestParamsType, ResponseContent } from './types';

type Params = {
  [k: string]: string | string[] | null | undefined | Params;
};

async function getResObject(r: Response) {
  const textBody = await r.text();
  try {
    return JSON.parse(textBody);
  } catch (e) {
    return textBody;
  }
}

const flattenParams = (
  params: Params | null | undefined
): Record<string, string | string[]> => {
  if (params) {
    return Object.entries(params).reduce(
      (acc, [key, value]) =>
        Array.isArray(value) || typeof value !== 'object'
          ? { ...acc, [key]: value }
          : { ...acc, ...flattenParams(value) },
      {}
    );
  } else {
    return {};
  }
};

function buildQuery(object: { [key: string]: any }): string {
  return Object.keys(object)
    .filter((k) => !!object[k])
    .map((k) => {
      if (Array.isArray(object[k])) {
        return object[k]
          .map((v: any) => encodeURIComponent(k) + '=' + encodeURIComponent(v))
          .join('&');
      } else {
        return encodeURIComponent(k) + '=' + encodeURIComponent(object[k]);
      }
    })
    .join('&');
}

async function customFetch(
  input: RequestInfo,
  options: GlobalOptions,
  init?: RequestInit
): Promise<Response> {
  if (options.apiUrl === undefined) {
    throw 'Api url not specified';
  }
  if (options.apiKey === undefined) {
    throw 'Api key not specified';
  }

  init = init || {};
  init.headers = init.headers || {};
  init.headers = {
    ...init.headers,
    'X-API-Key': options.apiKey,
  };

  return fetch(options.apiUrl + input, init)
    .then(async (r) => {
      if (!r.ok) {
        const data = await getResObject(r);
        const message = `${r.status}: ${
          data?.message || 'Error status code from server'
        }`;
        throw new Error(message);
      }
      return await getResObject(r);
    })
    .catch((e) => {
      throw e.message || 'Failed to fetch';
    });
}

export const addProjectIdToUrl = (url: string) => {
  return url.replace('/projects/', '/projects/{projectId}/');
};

export async function client<
  Url extends keyof Paths,
  Method extends keyof Paths[Url],
  Paths = paths
>(
  url: Url,
  method: Method,
  request: RequestParamsType<Url, Method, Paths>,
  options: GlobalOptions
) {
  const pathParams = (request as any)?.path || {};
  let urlResult = url as string;

  const projectId = getProjectIdFromApiKey(options.apiKey) || options.projectId;
  if (projectId !== undefined) {
    pathParams.projectId = projectId;
    urlResult = addProjectIdToUrl(urlResult);
  }

  if (pathParams) {
    Object.entries(pathParams).forEach(([key, value]) => {
      urlResult = urlResult.replace(`{${key}}`, value as any);
    });
  }

  const formData = request?.content?.['multipart/form-data'] as Record<
    string,
    unknown
  >;
  let body: FormData | undefined = undefined;
  if (formData) {
    body = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        let fileName: undefined | string = undefined;
        if (Object.prototype.toString.call(value) === '[object File]') {
          fileName = (value as any as File).name;
        }

        value.forEach((item) => body?.append(key, item as any, fileName));
        return;
      }
      body?.append(key, value as any);
    });
  }

  const jsonBody = JSON.stringify(request?.content?.['application/json']);

  const queryParams = request?.query as any;
  let queryString = '';

  const params = flattenParams(queryParams);
  const query = buildQuery(params);
  if (query) {
    queryString = '?' + query;
  }

  return customFetch(urlResult + queryString, options, {
    method: method as string,
    body: body || jsonBody,
    headers: jsonBody
      ? {
          'Content-Type': 'application/json',
        }
      : undefined,
  }) as Promise<ResponseContent<Url, Method, Paths>>;
}
