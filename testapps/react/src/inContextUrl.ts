// Window.__TOLGEE_IN_CONTEXT_URL__ is declared by @tolgee/web's loadInContextLib.ts; its built .d.ts is not visible
// from this app's own tsconfig, so the cast (rather than the augmentation) is needed here.
if (import.meta.env.VITE_APP_IN_CONTEXT_URL) {
  (
    window as unknown as { __TOLGEE_IN_CONTEXT_URL__?: string }
  ).__TOLGEE_IN_CONTEXT_URL__ = import.meta.env.VITE_APP_IN_CONTEXT_URL;
}
