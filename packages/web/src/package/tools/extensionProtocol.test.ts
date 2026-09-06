import {
  EXTENSION_PROTOCOL_VERSION,
  EXTENSION_REQUEST_TIMEOUT_MS,
} from './extensionProtocol';

// Pinned: the browser extension's src/protocol.ts carries the mirror values, and shipped extensions answer within
// PROXY_BUDGET_MS (30 s).
describe('extension protocol', () => {
  it('speaks protocol 2', () => {
    expect(EXTENSION_PROTOCOL_VERSION).toBe(2);
  });

  it("waits longer than the extension's reply budget", () => {
    const EXTENSION_PROXY_BUDGET_MS = 30_000;
    expect(EXTENSION_REQUEST_TIMEOUT_MS).toBe(35_000);
    expect(EXTENSION_REQUEST_TIMEOUT_MS).toBeGreaterThan(
      EXTENSION_PROXY_BUDGET_MS
    );
  });
});
