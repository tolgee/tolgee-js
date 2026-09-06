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
  | 'extension_session_missing'
  | 'extension_request_too_large'
  | 'extension_editing_off'
  // Emitted by the platform's OAuth2AccessTokenResolver (tolgee-platform#3893). Staged here as custom codes until
  // that PR merges and `npm run schema` is re-run against it, at which point these two belong in
  // ErrorResponseTypedCode instead and this pair should be deleted.
  | 'invalid_oauth_token'
  | 'oauth_token_expired';

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

// The transport an extension-connected page runs (proxyTransport, built by the app's own bundle) can throw an
// HttpError from a different bundle than the one rendering the dialog (the CDN in-context-tools UMD): `instanceof`
// then fails even though the object is shaped exactly like this class, so callers duck-type on `code` instead.
export function isHttpError(error: unknown): error is HttpError {
  return (
    error instanceof Error &&
    typeof (error as { code?: unknown }).code === 'string'
  );
}
