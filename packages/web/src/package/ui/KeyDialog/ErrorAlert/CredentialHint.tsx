import { OpenExtension } from './OpenExtension';
import { DocsAPIKeys } from './DocsAPIKeys';

export function CredentialHint({ viaExtension }: { viaExtension: boolean }) {
  return viaExtension ? (
    <>
      Your account can do this, but the sign-in this page uses doesn't include
      that permission. Sign in again in the Tolgee plugin. <OpenExtension />
    </>
  ) : (
    <>
      Your account can do this, but the API key this page uses doesn't include
      that permission. Use a key with more permissions. <DocsAPIKeys />
    </>
  );
}
