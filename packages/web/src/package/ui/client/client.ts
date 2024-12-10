import { createFetchFunction } from '@tolgee/core';
import { getProjectIdFromApiKey } from '../../tools/decodeApiKey';
import { paths } from './apiSchema.generated';
import { GlobalOptions } from './QueryProvider';
import { RequestParamsType, ResponseContent } from './types';
import { HttpError } from './HttpError';
import { isUrlValid } from '../tools/validateUrl';
import { createUrl } from '../../tools/url';

const errorFromResponse = (status: number, body: any) => {
  if (body?.code) {
    return new HttpError(body.code, status, body.params);
  } else {
    return new HttpError('fetch_error', status);
  }
};

const fetchFn = createFetchFunction();

type Params = {
  [k: string]: string | string[] | null | undefined | Params;
};

async function getResObject(r: Response) {
  const textBody = await r.text();
  try {
    return JSON.parse(textBody);
  } catch (e) {
    throw new HttpError('fetch_error');
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
) {
  if (options.apiUrl === undefined) {
    throw new HttpError('api_url_not_specified');
  }
  if (!isUrlValid(options.apiUrl)) {
    throw new HttpError('api_url_not_valid');
  }
  if (options.apiKey === undefined) {
    throw new HttpError('api_key_not_specified');
  }

  init = init || {};
  init.headers = init.headers || {};
  init.headers = {
    ...init.headers,
    'X-API-Key': options.apiKey,
  };

  const url = createUrl(options.apiUrl, input.toString()).toString();
  return fetchFn(url, init).then(async (r) => {
    if (!r.ok) {
      const data = await getResObject(r);
      throw errorFromResponse(r.status, data);
    }
    const result = await getResObject(r);
    if (typeof result === 'object' && result !== null) {
      result._internal = {
        version: r.headers.get('X-Tolgee-Version'),
      };
    }
    return result;
  });
}

export const addProjectIdToUrl = (url: string) => {
  return url.replace('/projects/', '/projects/{projectId}/');
};

export async function client<
  Url extends keyof Paths,
  Method extends keyof Paths[Url],
  Paths = paths,
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
