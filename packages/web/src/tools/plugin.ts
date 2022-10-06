type Props = {
  message: string;
  recievingMessage: string[];
  data?: any;
};

export function listen<T = any>(type: string[], callback: (data?: T) => any) {
  const handler = (e: MessageEvent) => {
    if (type.includes(e.data?.type)) {
      callback(e.data?.data);
    }
  };
  window.addEventListener('message', handler, false);
  return {
    unsubscribe: () => {
      window.removeEventListener('message', handler);
    },
  };
}

function sendAndRecieve<T>(
  { message, recievingMessage, data }: Props,
  attempts = 1
) {
  let cancelled = false;
  const makeAttempt = () =>
    new Promise((resolve, reject) => {
      const listener = listen(recievingMessage, handler);
      window.postMessage({ type: message, data }, window.origin);
      const timer = setTimeout(timeout, 300);

      function handler(data: any) {
        clearTimeout(timer);
        removeEventListener();
        resolve(data);
      }
      function removeEventListener() {
        listener.unsubscribe();
      }
      function timeout() {
        removeEventListener();
        reject(new Error(`Didn't recieve ${recievingMessage} in time.`));
      }
    });

  return {
    cancel: () => (cancelled = true),
    promise: new Promise<T>(async (resolve, reject) => {
      for (let i = 0; i < 4; i++) {
        if (cancelled) {
          break;
        }
        try {
          const result = await makeAttempt();
          return result;
        } catch {
          continue;
        }
      }
      if (!cancelled) {
        throw new Error('Tolgee extension not present');
      }
    }),
  };
}

export function takeScreenshot(): Promise<string> {
  return sendAndRecieve({
    message: 'TOLGEE_TAKE_SCREENSHOT',
    recievingMessage: ['TOLGEE_SCREENSHOT_TAKEN'],
  }).promise as Promise<string>;
}

export async function detectPlugin(): Promise<boolean> {
  try {
    await sendAndRecieve(
      {
        message: 'TOLGEE_PING',
        recievingMessage: ['TOLGEE_PONG'],
      },
      2
    ).promise;
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
    const { cancel, promise } = sendAndRecieve<boolean>(
      {
        message: 'TOLGEE_READY',
        recievingMessage: ['TOLGEE_PLUGIN_READY', 'TOLGEE_PLUGIN_UPDATED'],
        data,
      },
      4
    );
    cancelLast = cancel;
    return promise;
  }
  return {
    update,
  };
}
