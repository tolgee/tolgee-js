import { Alert, AlertTitle } from '@mui/material';
import { HttpError } from '../client/HttpError';
import { useDialogContext } from './dialogContext';
import { NewTabLink } from './Link';
import { createUrl } from '../../tools/url';

type Props = {
  error: HttpError | Error;
  severity?: 'error' | 'info';
};

export const ErrorAlert = ({ error, severity = 'error' }: Props) => {
  const apiUrl = useDialogContext((c) => c.uiProps.apiUrl);

  return (
    <Alert sx={{ mt: 2 }} severity={severity}>
      {error instanceof HttpError
        ? getErrorContent(error, createUrl(apiUrl).toString())
        : error.message}
    </Alert>
  );
};

function DocsInContext() {
  return (
    <NewTabLink href="https://tolgee.io/js-sdk/in-context">
      Learn more in Docs
    </NewTabLink>
  );
}

function DocsAPIKeys() {
  return (
    <NewTabLink href="https://tolgee.io/platform/account_settings/api_keys_and_pat_tokens">
      Learn more in Docs
    </NewTabLink>
  );
}

function getErrorContent({ code, params, message }: HttpError, apiUrl: string) {
  switch (code) {
    case 'operation_not_permitted':
      return (
        <>
          <AlertTitle>Operation not permitted</AlertTitle>
          {Boolean(params?.length) && 'Missing scopes: ' + params?.join(', ')}
        </>
      );

    case 'invalid_project_api_key':
      return (
        <>
          <AlertTitle>Invalid API key</AlertTitle>
          Check it in the code or in the chrome plugin. <DocsInContext />
        </>
      );

    case 'api_url_not_specified':
      return (
        <>
          <AlertTitle>Oops... I miss the API url</AlertTitle>
          Add it in the code or via the chrome plugin. <DocsInContext />
        </>
      );

    case 'api_url_not_valid':
      return (
        <>
          <AlertTitle>API url is not correct ({apiUrl})</AlertTitle>
          Check it in the code or in the chrome plugin. <DocsInContext />
        </>
      );

    case 'api_key_not_specified':
      return (
        <>
          <AlertTitle>Oops... I miss the API key</AlertTitle>
          Add it in the code or via the chrome plugin. <DocsInContext />
        </>
      );

    case 'permissions_not_sufficient_to_edit':
      return (
        <>
          <AlertTitle>
            Sorry, you don't have permissions to make changes
          </AlertTitle>
          Update your API key or ask admin for more permissions <DocsAPIKeys />
        </>
      );

    case 'fetch_error':
      return `Failed to fetch (${apiUrl})`;

    default:
      return message;
  }
}
