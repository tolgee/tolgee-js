import { CommandLineServiceConfig, DockerComposeServiceConfig } from '../types';
import { ServiceMonitor } from '../ServiceMonitor';
import { CommandLineServiceRunner } from './CommandLineServiceRunner';
import { DockerComposeRunner } from './DockerComposeRunner';

export const ServicesRunner = ({
  dockerComposeServices = {},
  commandLineServices = {},
  stdoutServices,
}: {
  dockerComposeServices?: Record<string, DockerComposeServiceConfig>;
  commandLineServices?: Record<string, CommandLineServiceConfig>;
  stdoutServices?: string;
}) => {
  const servicesToRun = [
    ...Object.keys(dockerComposeServices),
    ...Object.keys(commandLineServices),
  ];

  const runners: Record<
    string,
    | ReturnType<typeof CommandLineServiceRunner>
    | ReturnType<typeof DockerComposeRunner>
  > = {};

  const stdOutServicesArray =
    stdoutServices?.split(',').filter((val) => Boolean(val)) || [];

  const runServices = () =>
    new Promise<void>((resolve, reject) => {
      const timeoutHandles: NodeJS.Timeout[] = [];
      function shouldPrint(service: string) {
        return (
          stdOutServicesArray.includes(service) ||
          stdOutServicesArray.length === 0
        );
      }

      const serviceMonitor = ServiceMonitor(servicesToRun, () => {
        timeoutHandles.forEach((handle) => clearTimeout(handle));
        resolve();
      });

      const onStdout = (service, data) => {
        if (shouldPrint(service)) {
          serviceMonitor.log(service, data);
        }
      };

      const onStdErr = (service, data) => {
        if (shouldPrint(service)) {
          serviceMonitor.log(service, `stderr: ${data.toString()}`);
        }
      };

      Object.entries(commandLineServices).forEach(([service, config]) => {
        runners[service] = CommandLineServiceRunner({
          config: config,
          onStdout(data) {
            onStdout(service, data);
          },
          onStderr(data) {
            if (config.stdErrEnabled !== false) {
              onStdErr(service, data);
            }
          },
        });
      });

      Object.entries(dockerComposeServices).forEach(([service, config]) => {
        runners[service] = DockerComposeRunner({
          serviceName: service,
          config: config,
          onStdout(data) {
            onStdout(service, data);
          },
          onStderr(data) {
            if (config.stdErrEnabled !== false) {
              onStdErr(service, data);
            }
          },
        });
      });

      Object.entries(runners).forEach(([serviceName, runner]) => {
        const timeoutHandle = setTimeout(
          () => {
            if (!serviceMonitor.isRunning(serviceName)) {
              reject(Error(`Service ${serviceName} timed out...`));
            }
          },
          runner.config.timeout || 3 * 60 * 1000
        );
        timeoutHandles.push(timeoutHandle);
        runner
          .run()
          .then(() => {
            serviceMonitor.setRunning(serviceName);
          })
          .catch((e) => reject(e));
      });
    });

  return {
    run() {
      return runServices();
    },
    async exit() {
      return Promise.all(Object.values(runners).map((runner) => runner.exit()));
    },
  };
};
