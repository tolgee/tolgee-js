import { CommandLineServiceConfig } from '../types';
import { spawn } from 'child_process';
import { checkOutput } from './checkOutput';
import { log } from '../log';
import terminate from 'terminate';

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

      if (!config.waitForOutput) {
        resolve();
      }
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

  function getProcessName() {
    return `${spawnedProcess.spawnargs.join(' ')}`;
  }

  const self = {
    config,
    async run() {
      try {
        return runService();
      } catch (e) {
        await self.exit();
        throw e;
      }
    },
    exit() {
      log('info', `Terminating process "${getProcessName()}"`);
      // force terminate child processes
      return new Promise<void>((resolve, reject) => {
        terminate(spawnedProcess.pid!, { timeout: 5000 }, (err) =>
          err ? reject(err) : resolve()
        );
      });
    },
  };
  return self;
};
