import { Alert, AlertTitle, Link } from '@mui/material';
import { HttpError } from '../client/HttpError';
import { useDialogContext } from './dialogContext';
import { NewTabLink } from './Link';
import { createUrl } from '../../tools/url';
import { openPlugin } from '../../tools/extension';

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

function OpenExtension() {
  return (
    <Link
      component="button"
      type="button"
      sx={{ verticalAlign: 'baseline' }}
      onClick={openPlugin}
    >
      Open the Tolgee plugin
    </Link>
  );
}

function DocsAPIKeys() {
  return (
    <NewTabLink href="https://tolgee.io/platform/account_settings/api_keys_and_pat_tokens">
      Learn more in Docs
    </NewTabLink>
  );
}

export function getErrorContent(
  { code, params, message }: HttpError,
  apiUrl: string
) {
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

    case 'unauthenticated':
    case 'invalid_jwt_token':
    case 'expired_jwt_token':
    case 'general_jwt_error':
    case 'invalid_oauth_token':
    case 'oauth_token_expired':
      return (
        <>
          <AlertTitle>You're not signed in</AlertTitle>
          Sign in again in the Tolgee plugin to keep editing. <OpenExtension />
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
          <AlertTitle>Oops... I miss the API key or access token</AlertTitle>
          Add it in the code or via the chrome plugin. <DocsInContext />
        </>
      );

    case 'project_id_not_specified':
      return (
        <>
          <AlertTitle>Oops... I miss the project id</AlertTitle>
          An OAuth token or PAT carries no project, so projectId must be set in
          the Tolgee configuration. <DocsInContext />
        </>
      );

    case 'project_not_found':
      return (
        <>
          <AlertTitle>Project not found</AlertTitle>
          The configured project doesn't exist on this server, or your account
          can't access it. Check the projectId in the Tolgee configuration, or
          ask for access. <DocsInContext />
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

    case 'operation_not_permitted_in_read_only_mode':
      return (
        <>
          <AlertTitle>Read-only mode</AlertTitle>
          This branch is protected or your access is read-only.
        </>
      );

    case 'branch_not_found':
      return (
        <>
          <AlertTitle>Branch not found</AlertTitle>
          Check the branch name or switch to an existing branch.
        </>
      );

    case 'fetch_error':
      return `Failed to fetch (${apiUrl})`;

    default:
      return message;
  }
}
