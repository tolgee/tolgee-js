let debug = false;

export const setDebug = (value: boolean) => {
  debug = value;
};

export const log = (
  type: 'info' | 'error' | 'debug',
  message: any,
  options?: { serviceName: string; color: number }
) => {
  const defaultColor = '\x1b[39m';
  const serviceColor = `\x1b[${options?.color}m`;
  const serviceStr = options
    ? `[${serviceColor}${options?.serviceName}${defaultColor}]`
    : '';
  const str = message
    ?.toString?.()
    .replace(/\n+/gm, '\n')
    .replace(/\n$/gm, '')
    .replace(
      // eslint-disable-next-line no-control-regex
      /[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g,
      ''
    )
    .replace(
      /^/gm,
      `${new Date().toLocaleString('en-US', {
        hour12: false,
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
      })} ${serviceStr}: `
    );
  if (!str) {
    return;
  }
  switch (type) {
    case 'info':
      // eslint-disable-next-line no-console
      console.log(str);
      break;
    case 'debug':
      if (debug)
        // eslint-disable-next-line no-console
        console.log(str);
      break;
    case 'error':
      // eslint-disable-next-line no-console
      console.error(str);
  }
};
