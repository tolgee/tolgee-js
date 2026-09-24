import { HttpError, isHttpError } from '../../client/HttpError';

// Missing credentials, in the page or in the extension, is the normal state of a page nobody has connected yet,
// not a failure.
export function severityFor(error: HttpError | Error): 'error' | 'info' {
  return isHttpError(error) &&
    (error.code === 'api_key_not_specified' ||
      error.code === 'extension_session_missing' ||
      error.code === 'extension_editing_off')
    ? 'info'
    : 'error';
}
