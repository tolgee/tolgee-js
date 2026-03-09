import { DockerComposeServiceConfig } from '../types';
import { spawn } from 'child_process';
import path from 'path';
import { CommandRunner } from '../CommandRunner';
import { checkOutput } from './checkOutput';

const cwd = path.resolve(__dirname, '../../../e2e');

export const DockerComposeRunner = ({
  serviceName,
  config,
  onStdout,
  onStderr,
}: {
  serviceName: string;
  config: DockerComposeServiceConfig;
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
        if (finished) {
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

      spawnedProcess = spawn('docker', ['compose', 'up', serviceName], {
        cwd,
        shell: true,
      });
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
          markRejected(Error(`Docker exited unexpectedly with code ${code}`));
        }
      });
    });

  const forceRemoveService = () => {
    return CommandRunner({
      command: `docker compose rm -s -v ${serviceName} --force`,
      cwd,
    }).run();
  };

  return {
    config,
    async run() {
      await forceRemoveService();
      return runService();
    },
    exit() {
      spawnedProcess?.kill();
    },
  };
};
