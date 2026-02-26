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
  let finished = false;

  const runService = () =>
    new Promise<void>((resolve, reject) => {
      let outputBuffer = '';
      const MAX_BUFFER_LENGTH = 10_000;
      const markResolved = () => {
        if (!finished) {
          finished = true;
          resolve();
        }
      };
      const markRejected = (error: Error) => {
        if (!finished) {
          finished = true;
          reject(error);
        }
      };
      const pushOutputAndCheck = (chunk: string) => {
        if (!config.waitForOutput || finished) {
          return;
        }
        outputBuffer += chunk;
        if (outputBuffer.length > MAX_BUFFER_LENGTH) {
          outputBuffer = outputBuffer.slice(-MAX_BUFFER_LENGTH);
        }
        if (checkOutput(outputBuffer, config.waitForOutput)) {
          markResolved();
        }
      };

      spawnedProcess = spawn(config.command, [], {
        cwd: config.cwd,
        env: { ...process.env, ...config.environment },
        shell: true,
      });

      if (!config.waitForOutput) {
        markResolved();
      }
      spawnedProcess.stdout.on('data', (data) => {
        onStdout(data);
        pushOutputAndCheck(data.toString());
      });

      spawnedProcess.stderr.on('data', (data) => {
        onStderr(data);
        pushOutputAndCheck(data.toString());
      });

      spawnedProcess.on('error', (error) => {
        markRejected(error);
      });

      spawnedProcess.on('close', (code) => {
        if (!finished) {
          markRejected(Error(`Exited unexpectedly with code ${code}`));
        }
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
