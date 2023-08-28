import { useDialogContext } from './index';

export function isAuthorizedTo(
  scope: string,
  scopes: string[] | undefined,
  isPat: boolean
) {
  return Boolean(scopes?.includes(scope)) || isPat;
}

export const usePermissions = () => {
  const scopes = useDialogContext((c) => c.scopes);
  const isPat = useDialogContext((c) => c.isPat);

  return (scope: string) => isAuthorizedTo(scope, scopes, isPat);
};
