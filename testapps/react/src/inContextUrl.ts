// Dev only: point the in-context editor UMD at a local build instead of the CDN, so unpublished @tolgee/web changes
// (e.g. OAuth Bearer support) can be exercised in-context. This MUST run before App.tsx, which builds the Tolgee
// instance at module scope — the loader reads window.__TOLGEE_IN_CONTEXT_URL__ during that init, so setting it later
// (a plain statement in main.tsx, after the hoisted App import) is too late. Imported first in main.tsx.
if (import.meta.env.VITE_APP_IN_CONTEXT_URL) {
  (
    window as unknown as { __TOLGEE_IN_CONTEXT_URL__?: string }
  ).__TOLGEE_IN_CONTEXT_URL__ = import.meta.env.VITE_APP_IN_CONTEXT_URL;
}
