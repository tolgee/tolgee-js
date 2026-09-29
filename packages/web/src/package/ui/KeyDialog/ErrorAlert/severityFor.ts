import { HttpError, isHttpError } from '../../client/HttpError';

export function severityFor(error: HttpError | Error): 'error' | 'info' {
  return isHttpError(error) &&
    (error.code === 'api_key_not_specified' ||
      error.code === 'extension_session_missing' ||
      error.code === 'extension_editing_off')
    ? 'info'
    : 'error';
}
