type Props = {
  message: string;
  recievingMessage: string[];
  data?: any;
  attempts?: number;
  timeout?: number;
};

export function listen<T = any>(type: string[], callback: (data?: T) => any) {
  const handler = (e: MessageEvent) => {
    if (type.includes(e.data?.type)) {
      callback(e.data?.data);
    }
  };
  window.addEventListener('message', handler, false);
  return {
    unsubscribe() {
      window.removeEventListener('message', handler);
    },
  };
}

export function sendAndRecieve<T>({
  message,
  recievingMessage,
  data,
  attempts = 1,
  timeout = 300,
}: Props) {
  let cancelled = false;
  const makeAttempt = () =>
    new Promise<T>((resolve, reject) => {
      const listener = listen(recievingMessage, handler);
      window.postMessage({ type: message, data }, window.origin);
      const timer = setTimeout(expire, timeout);

      function handler(data: any) {
        clearTimeout(timer);
        removeEventListener();
        resolve(data);
      }
      function removeEventListener() {
        listener.unsubscribe();
      }
      function expire() {
        removeEventListener();
        reject();
      }
    });

  const getData = async (): Promise<T> => {
    for (let i = 0; i < attempts; i++) {
      if (cancelled) {
        return new Promise<T>(() => {});
      }
      try {
        const result = await makeAttempt();
        return result;
      } catch (e) {
        continue;
      }
    }
    if (!cancelled) {
      throw `Didn't recieve ${recievingMessage.join(' or ')} in time.`;
    }
    return new Promise<T>(() => {});
  };

  return {
    cancel() {
      cancelled = true;
    },
    promise: getData(),
  };
}

export function takeScreenshot(): Promise<string> {
  return sendAndRecieve({
    message: 'TOLGEE_TAKE_SCREENSHOT',
    recievingMessage: ['TOLGEE_SCREENSHOT_TAKEN'],
    timeout: 3000,
  }).promise as Promise<string>;
}

export async function detectExtension(): Promise<boolean> {
  try {
    await sendAndRecieve({
      message: 'TOLGEE_PING',
      recievingMessage: ['TOLGEE_PONG'],
      attempts: 2,
    }).promise;
    return true;
  } catch {
    return false;
  }
}

export type LibConfig = {
  uiPresent: boolean;
  uiVersion?: string;
  mode: 'production' | 'development';
  config: {
    apiUrl: string;
    apiKey: string;
  };
};

export function Handshaker() {
  let cancelLast: undefined | (() => void) = undefined;
  async function update(data: LibConfig): Promise<boolean> {
    cancelLast?.();
    const { cancel, promise } = sendAndRecieve<boolean>({
      message: 'TOLGEE_READY',
      recievingMessage: ['TOLGEE_PLUGIN_READY', 'TOLGEE_PLUGIN_UPDATED'],
      data,
      attempts: 4,
    });
    cancelLast = cancel;
    return promise;
  }
  return {
    update,
  };
}
