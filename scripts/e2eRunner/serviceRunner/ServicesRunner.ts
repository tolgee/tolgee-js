import { CommandLineServiceConfig, DockerComposeServiceConfig } from '../types';
import { ServiceMonitor } from '../serviceMonitor';
import { CommandLineServiceRunner } from './CommandLineServiceRunner';
import { DockerComposeRunner } from './dockerComposeRunner';

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
    | ReturnType<typeof CommandLineServiceRunner>
  > = {};

  const stdOutServicesArray = stdoutServices?.split(',') || [];

  const runServices = () =>
    new Promise<void>((resolve, reject) => {
      const serviceMonitor = ServiceMonitor(servicesToRun, () => {
        resolve();
      });

      const onStdout = (service, data) => {
        if (stdOutServicesArray.includes(service)) {
          serviceMonitor.log(service, data);
        }
      };

      const onStdErr = (service, data) => {
        if (stdOutServicesArray.includes(service)) {
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
    exit() {
      Object.values(runners).forEach((runner) => runner.exit());
    },
  };
};
