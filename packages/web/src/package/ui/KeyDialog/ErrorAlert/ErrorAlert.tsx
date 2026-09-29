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
  const credentialBlocksSubmit = useDialogContext(
    (c) => c.permissions.credentialBlocksSubmit
  );
  const accountHolds = useDialogContext((c) => c.permissions.accountHolds);
  const viaExtension = useDialogContext((c) => c.viaExtension);

  return (
    <Alert
      sx={{ mt: 2 }}
      severity={severity ?? severityFor(error)}
      data-cy="error-alert"
      data-cy-error-code={isHttpError(error) ? error.code : undefined}
    >
      {isHttpError(error)
        ? getErrorContent(error, createUrl(apiUrl).toString(), {
            credentialBlocksSubmit,
            accountHolds,
            viaExtension,
          })
        : error.message}
    </Alert>
  );
};
