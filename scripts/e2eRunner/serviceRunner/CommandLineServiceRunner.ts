import { CommandLineServiceConfig } from '../types';
import { spawn } from 'child_process';
import { checkOutput } from './checkOutput';

export const CommandLineServiceRunner = ({
  config,
  onStdout,
  onStderr,
}: {
  config: CommandLineServiceConfig;
  onStdout: (data: any) => void;
  onStderr: (data: any) => void;
}) => {
  let spawnedProcess: ReturnType<typeof spawn>;

  const runService = () =>
    new Promise<void>((resolve, reject) => {
      spawnedProcess = spawn(config.command, [], {
        cwd: config.cwd,
        env: { ...process.env, ...config.environment },
        shell: true,
      });
      spawnedProcess.stdout.on('data', (data) => {
        onStdout(data);
        if (checkOutput(data.toString(), config.waitForOutput)) {
          resolve();
        }
      });

      spawnedProcess.stderr.on('data', (data) => {
        onStderr(data);
      });

      spawnedProcess.on('error', (error) => {
        reject(error);
        throw error;
      });

      spawnedProcess.on('close', () => {
        throw Error('Exited unexpectedly');
      });
    });

  return {
    async run() {
      return runService();
    },
    exit() {
      spawnedProcess.kill();
    },
  };
};
