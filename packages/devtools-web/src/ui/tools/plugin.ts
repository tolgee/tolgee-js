import { sleep } from './sleep';

type Props = {
  message: string;
  recievingMessage: string;
  data?: any;
};

function sendAndRecieve({ message, recievingMessage, data }: Props) {
  return new Promise((resolve, reject) => {
    window.addEventListener('message', handler, false);
    window.postMessage({ type: message, data }, window.origin);
    const timer = setTimeout(timeout, 300);

    function handler(e: MessageEvent) {
      if (e.data.type === recievingMessage) {
        clearTimeout(timer);
        removeEventListener();
        resolve(e.data.data);
      }
    }
    function removeEventListener() {
      window.removeEventListener('message', handler);
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
