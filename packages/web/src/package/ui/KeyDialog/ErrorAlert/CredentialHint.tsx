import { OpenExtension } from './OpenExtension';
import { DocsAPIKeys } from './DocsAPIKeys';

export function CredentialHint({ viaExtension }: { viaExtension: boolean }) {
  return viaExtension ? (
    <>
      The Tolgee plugin doesn't have this permission yet. Sign in again to grant
      it. <OpenExtension />
    </>
  ) : (
    <>
      The API key this page uses doesn't have this permission. Create a new API
      key that includes it. <DocsAPIKeys />
    </>
  );
}
