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

  const runService = () =>
    new Promise<void>((resolve, reject) => {
      spawnedProcess = spawn('docker', ['compose', 'up', serviceName], {
        cwd,
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
        throw Error('Docker exited unexpectedly');
      });
    });

  const forceRemoveService = () => {
    return CommandRunner({
      command: `docker compose rm -s -v ${serviceName} --force`,
      cwd,
    }).run();
  };

  return {
    async run() {
      await forceRemoveService();
      return runService();
    },
    exit() {
      spawnedProcess?.kill();
    },
  };
};
