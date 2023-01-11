import { spawn } from 'child_process';
import { log } from './log';

export const CommandRunner = ({
  command,
  cwd,
}: {
  command: string;
  cwd: string;
}) => {
  let process: ReturnType<typeof spawn>;

  const run = () =>
    new Promise((resolve, reject) => {
      process = spawn(command, {
        cwd,
        shell: true,
      });
      process.stdout.on('data', (data) => {
        log('debug', data);
      });

      process.stderr.on('data', (data) => {
        log('error', data);
      });

      process.on('error', (error) => {
        throw error;
      });

      process.on('close', (code) => {
        if (code === 0) {
          resolve(code);
        } else {
          reject(code);
        }
      });
    });

  return {
    run,
  };
};
