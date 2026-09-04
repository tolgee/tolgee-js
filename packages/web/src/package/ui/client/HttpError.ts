import { components } from './apiSchema.generated';

type ErrorResponseTypedCode =
  components['schemas']['ErrorResponseTyped']['code'];

type ErrorCustomStatus =
  | 'fetch_error'
  | 'api_url_not_specified'
  | 'api_key_not_specified'
  | 'project_id_not_specified'
  | 'api_url_not_valid'
  | 'permissions_not_sufficient_to_edit'
  // Emitted by the platform's OAuth2AccessTokenResolver (tolgee-platform#3893). Staged here as custom codes until
  // that PR merges and `npm run schema` is re-run against it, at which point these two belong in
  // ErrorResponseTypedCode instead and this pair should be deleted.
  | 'invalid_oauth_token'
  | 'oauth_token_expired'
  // Answered by the browser extension when it proxies a request: no session for this page, or the body is over the
  // extension's payload cap.
  | 'extension_session_missing'
  | 'extension_request_too_large';

export type ErrorStatusCode = ErrorResponseTypedCode | ErrorCustomStatus;

function getErrorMessage(code: ErrorStatusCode, status?: number | undefined) {
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
    super(getErrorMessage(code, status));

    // Set the prototype explicitly.
    Object.setPrototypeOf(this, HttpError.prototype);
  }
}
