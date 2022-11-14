import { log } from './log';

export const ServiceMonitor = (toRun: string[], onAllRunning: () => void) => {
  const state: Record<string, { running: boolean; color: number }> = {};

  const colors = [31, 32, 33, 34, 35, 36];

  const getColor = () => {
    const unusedColors = colors.filter(
      (c) =>
        Object.values(state).findIndex(
          (serviceState) => serviceState.color === c
        ) === -1
    );
    const idx = Math.floor(Math.random() * unusedColors.length);
    return unusedColors[idx];
  };

  toRun.forEach(
    (service) => (state[service] = { running: false, color: getColor() })
  );

  const toRunCount = Object.values(state).length;
  const getRunningCount = () =>
    Object.values(state).filter((i) => i.running === true).length;

  const isAllRunning = () => {
    return Object.values(state).findIndex((s) => !s.running) === -1;
  };

  return {
    isRunning(service: string) {
      return state[service].running;
    },
    log(service: string, output: string) {
      log('info', output, {
        serviceName: service,
        color: state[service].color,
      });
    },
    setRunning(service: string) {
      state[service] = { ...state[service], running: true };
      log(
        'info',
        `🟢 Service ${service} is running. (${getRunningCount()}/${toRunCount})`
      );
      if (isAllRunning()) {
        onAllRunning();
      }
    },
  };
};
