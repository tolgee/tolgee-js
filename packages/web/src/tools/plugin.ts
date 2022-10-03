type Props = {
  message: string;
  recievingMessage: string;
  data?: any;
};

export function listen<T = any>(type: string, callback: (data?: T) => any) {
  const handler = (e: MessageEvent) => {
    if (e.data?.type === type) {
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

function sendAndRecieve({ message, recievingMessage, data }: Props) {
  return new Promise((resolve, reject) => {
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
}

export function takeScreenshot(): Promise<string> {
  return sendAndRecieve({
    message: 'TOLGEE_TAKE_SCREENSHOT',
    recievingMessage: 'TOLGEE_SCREENSHOT_TAKEN',
  }) as Promise<string>;
}

export async function detectPlugin(): Promise<boolean> {
  // try twice
  for (let i = 0; i < 2; i++) {
    try {
      await sendAndRecieve({
        message: 'TOLGEE_PING',
        recievingMessage: 'TOLGEE_PONG',
      });
      return true;
    } catch {
      continue;
    }
  }
  return false;
}

export type LibConfig = {
  noRestart: boolean;
  uiPresent: boolean;
  uiVersion?: string;
  mode: 'production' | 'development';
  config: {
    apiUrl: string;
    apiKey: string;
  };
};

export async function handshakeWithExtension(
  data: LibConfig
): Promise<boolean> {
  // try twice
  for (let i = 0; i < 4; i++) {
    try {
      await sendAndRecieve({
        message: 'TOLGEE_READY',
        recievingMessage: 'TOLGEE_PLUGIN_READY',
        data,
      });
      return true;
    } catch {
      continue;
    }
  }
  throw new Error('Tolgee extension not present');
}

export async function updateConfig(data: LibConfig): Promise<boolean> {
  try {
    await sendAndRecieve({
      message: 'TOLGEE_CONFIG_UPDATE',
      recievingMessage: 'TOLGEE_PLUGIN_UPDATED',
      data,
    });
    return true;
  } catch {
    throw new Error('Tolgee extension not present');
  }
}
