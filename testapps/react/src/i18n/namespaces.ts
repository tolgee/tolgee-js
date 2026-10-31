/**
 * Single source of truth for namespace identifiers used in this app.
 *
 * The Tolgee CLI extractor resolves `const NS = { ... } as const` references
 * within a single file, but it does NOT yet follow imports. Until cross-file
 * resolution lands, consumers (e.g. components/Namespaces.tsx) must also
 * declare an inline `const NS` mirroring the entries used in that file.
 * Keep this file as the authoritative list and mirror entries on demand.
 */
export const NS = {
  NAMESPACED: 'namespaced',
} as const;

export type Namespace = (typeof NS)[keyof typeof NS];
