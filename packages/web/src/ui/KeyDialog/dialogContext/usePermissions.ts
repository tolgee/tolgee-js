import { useDialogContext } from './index';
import { isAuthorizedTo } from './tools';

export const usePermissions = () => {
  const scopes = useDialogContext((c) => c.scopes);
  const isPat = useDialogContext((c) => c.isPat);

  return (scope: string) => isAuthorizedTo(scope, scopes, isPat);
};
