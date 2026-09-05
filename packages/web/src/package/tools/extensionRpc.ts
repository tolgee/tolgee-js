import {
  EXTENSION_REQUEST_TIMEOUT_MS,
  ExtensionErrorKind,
} from './extensionProtocol';

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

// The relay is a content script injected at document_start, so it answers within milliseconds when the extension
// is there at all; a tab still marked signed in after the extension was removed must not wait the request timeout.
export const RELAY_DISCOVERY_TIMEOUT_MS = 3_000;
const RELAY_PING_INTERVAL_MS = 200;
const RELAY_PING = 'TOLGEE_PROXY_PING';
const RELAY_PONG = 'TOLGEE_PROXY_PONG';

let counter = 0;
const pending = new Map<string, Pending>();
let listening = false;
let relayReady: Promise<void> | undefined;
let onRelayPong: (() => void) | undefined;

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
  const deadline = Date.now() + timeoutMs;
  await awaitRelay(Math.min(deadline, Date.now() + RELAY_DISCOVERY_TIMEOUT_MS));
  const remaining = deadline - Date.now();
  if (remaining <= 0) {
    throw noAnswerInTime(type);
  }
  const id = nextId();
  return new Promise<T>((resolve, reject) => {
    const timer = setTimeout(() => {
      pending.delete(id);
      forgetRelay();
      reject(noAnswerInTime(type));
    }, remaining);
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

const noAnswerInTime = (type: string) =>
  new ExtensionRpcError(
    'unavailable',
    `the Tolgee browser extension did not answer ${type} in time`
  );

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
      onRelayPong?.();
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

// window.postMessage has no queue, so the first request could leave before the extension's relay is listening; the
// idempotent ping is repeated until it answers.
function awaitRelay(deadline: number): Promise<void> {
  if (!relayReady) {
    relayReady = new Promise<void>((resolve, reject) => {
      const ping = () =>
        window.postMessage({ type: RELAY_PING }, window.origin);
      const giveUp = () => {
        clearInterval(timer);
        forgetRelay();
        onRelayPong = undefined;
        reject(
          new ExtensionRpcError(
            'unavailable',
            'the Tolgee browser extension did not answer'
          )
        );
      };
      const timer = setInterval(() => {
        if (Date.now() > deadline) {
          giveUp();
          return;
        }
        ping();
      }, RELAY_PING_INTERVAL_MS);
      onRelayPong = () => {
        clearInterval(timer);
        resolve();
      };
      ping();
    });
  }
  return relayReady;
}

function forgetRelay() {
  relayReady = undefined;
}
