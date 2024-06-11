import { components } from './apiSchema.generated';

type ErrorResponseTypedCode =
  components['schemas']['ErrorResponseTyped']['code'];

type ErrorCustomStatus =
  | 'fetch_error'
  | 'api_url_not_specified'
  | 'api_key_not_specified'
  | 'api_url_not_valid'
  | 'permissions_not_sufficient_to_edit';

export type ErrorStatusCode = ErrorResponseTypedCode | ErrorCustomStatus;

function getErrorMessage(
  code: ErrorStatusCode,
  status?: number | undefined,
  params?: string[] | undefined
) {
  if (status) {
    return `${status}: ${code}`;
  }
  return code;
}

export class HttpError extends Error {
  constructor(
    public code: ErrorStatusCode,
    public status?: number,
    public params?: string[]
  ) {
    super(getErrorMessage(code, status, params));

    // Set the prototype explicitly.
    Object.setPrototypeOf(this, HttpError.prototype);
  }
}
