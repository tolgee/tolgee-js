export type ExtensionErrorKind =
  | 'no_session'
  | 'not_allowed'
  | 'too_large'
  | 'network'
  | 'timeout'
  | 'unavailable';

export class ExtensionRpcError extends Error {
  constructor(
    public kind: ExtensionErrorKind,
    message: string
  ) {
    super(message);
    this.name = 'ExtensionRpcError';
    Object.setPrototypeOf(this, ExtensionRpcError.prototype);
  }
}

export type ExtensionApiResponse = {
  status: number;
  statusText: string;
  headers: Record<string, string | null>;
  body: string;
};

type ExtensionReply = {
  id: string;
  response?: ExtensionApiResponse;
  error?: { kind: ExtensionErrorKind; message: string };
};

export type ScreenshotUploadReply = {
  response: ExtensionApiResponse;
  width: number;
  height: number;
};

type Pending = {
  replyType: string;
  progressType?: string;
  onProgress?: () => void;
  resolve: (reply: any) => void;
  reject: (error: Error) => void;
  timer: ReturnType<typeof setTimeout>;
};

export const EXTENSION_REQUEST_TIMEOUT_MS = 35_000;
const RELAY_PING_INTERVAL_MS = 200;
const RELAY_PING = 'TOLGEE_PROXY_PING';
const RELAY_PONG = 'TOLGEE_PROXY_PONG';

let counter = 0;
const pending = new Map<string, Pending>();
let listening = false;
let relayReady: Promise<void> | undefined;
const relayListeners: (() => void)[] = [];

// crypto.randomUUID is missing on non-secure origins (an http:// dev host), so the id is built by hand.
const nextId = () => `${Date.now()}-${counter++}-${Math.random()}`;

function ensureListener() {
  if (listening) {
    return;
  }
  listening = true;
  window.addEventListener('message', (event: MessageEvent) => {
    if (event.source !== window || event.origin !== window.location.origin) {
      return;
    }
    const type = event.data?.type;
    if (type === RELAY_PONG) {
      relayListeners.splice(0).forEach((resolve) => resolve());
      return;
    }
    const data = event.data?.data as ExtensionReply | undefined;
    const entry = typeof data?.id === 'string' ? pending.get(data.id) : null;
    if (!entry) {
      return;
    }
    if (type === entry.progressType) {
      entry.onProgress?.();
      return;
    }
    if (type !== entry.replyType) {
      return;
    }
    pending.delete(data!.id);
    clearTimeout(entry.timer);
    if (data!.error) {
      entry.reject(
        new ExtensionRpcError(data!.error.kind, data!.error.message)
      );
    } else {
      entry.resolve(data);
    }
  });
}

// The extension's relay listens from document_start, but its module loads asynchronously, so on a fast (cached)
// page load the first request could leave before anyone hears it; window.postMessage has no queue. A ping is
// idempotent, so it is repeated until the relay answers, and the request itself is posted exactly once after that.
function awaitRelay(timeoutMs: number): Promise<void> {
  if (!relayReady) {
    relayReady = new Promise<void>((resolve, reject) => {
      const deadline = Date.now() + timeoutMs;
      const ping = () =>
        window.postMessage({ type: RELAY_PING }, window.origin);
      const timer = setInterval(() => {
        if (Date.now() > deadline) {
          clearInterval(timer);
          relayReady = undefined;
          reject(
            new ExtensionRpcError(
              'unavailable',
              'the Tolgee browser extension did not answer'
            )
          );
          return;
        }
        ping();
      }, RELAY_PING_INTERVAL_MS);
      relayListeners.push(() => {
        clearInterval(timer);
        resolve();
      });
      ping();
    });
  }
  return relayReady;
}

type RequestProps = {
  type: string;
  replyType: string;
  payload?: Record<string, unknown>;
  timeoutMs?: number;
  progressType?: string;
  onProgress?: () => void;
};

export async function requestFromExtension<T extends ExtensionReply>({
  type,
  replyType,
  payload,
  timeoutMs = EXTENSION_REQUEST_TIMEOUT_MS,
  progressType,
  onProgress,
}: RequestProps): Promise<T> {
  ensureListener();
  await awaitRelay(timeoutMs);
  const id = nextId();
  return new Promise<T>((resolve, reject) => {
    const timer = setTimeout(() => {
      pending.delete(id);
      reject(
        new ExtensionRpcError(
          'unavailable',
          `the Tolgee browser extension did not answer ${type} in time`
        )
      );
    }, timeoutMs);
    pending.set(id, {
      replyType,
      progressType,
      onProgress,
      resolve,
      reject,
      timer,
    });
    window.postMessage({ type, data: { id, ...payload } }, window.origin);
  });
}

/**
 * Asks the extension to capture the tab and upload the image itself. `onCaptured` fires as soon as the capture is
 * done, before the upload finishes, so the page can put itself back the way it was.
 */
export function uploadScreenshotViaExtension(
  onCaptured: () => void
): Promise<ScreenshotUploadReply> {
  return requestFromExtension<ExtensionReply & ScreenshotUploadReply>({
    type: 'TOLGEE_SCREENSHOT_UPLOAD',
    replyType: 'TOLGEE_SCREENSHOT_UPLOADED',
    progressType: 'TOLGEE_SCREENSHOT_CAPTURED',
    onProgress: onCaptured,
  });
}
