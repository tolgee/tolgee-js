import { Alert } from '@mui/material';
import { HttpError, isHttpError } from '../../client/HttpError';
import { useDialogContext } from '../dialogContext';
import { createUrl } from '../../../tools/url';
import { getErrorContent } from './getErrorContent';
import { severityFor } from './severityFor';

type Props = {
  error: HttpError | Error;
  severity?: 'error' | 'info';
};

export const ErrorAlert = ({ error, severity }: Props) => {
  const apiUrl = useDialogContext((c) => c.uiProps.apiUrl);

  return (
    <Alert
      sx={{ mt: 2 }}
      severity={severity ?? severityFor(error)}
      data-cy="error-alert"
      data-cy-error-code={isHttpError(error) ? error.code : undefined}
    >
      {isHttpError(error)
        ? getErrorContent(error, createUrl(apiUrl).toString())
        : error.message}
    </Alert>
  );
};
