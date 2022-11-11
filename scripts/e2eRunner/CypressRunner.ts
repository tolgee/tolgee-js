import { spawn } from 'child_process';
import { log } from './log';
import path from 'path';

export const CypressRunner = ({
  runType,
  spec,
  headed,
}: {
  spec?: string;
  runType: 'run' | 'open';
  headed: boolean;
}) => {
  let cypress: ReturnType<typeof spawn>;
  const isRun = runType === 'run';
  const headedParam = headed ? '--headed' : '';
  const specParam = spec && isRun ? `--spec "cypress/e2e/${spec}/**"` : '';
  const args = isRun ? `--browser chrome ${headedParam}` : '';

  const run = () =>
    new Promise<number>((resolve, reject) => {
      cypress = spawn(`cypress ${runType} ${args} ${specParam}`, {
        cwd: path.resolve(__dirname, '../../e2e'),
        shell: true,
      });
      cypress.stdout.on('data', (data) => {
        log('info', data);
      });

      cypress.stderr.on('data', (data) => {
        log('error', data);
      });

      cypress.on('error', (error) => {
        reject(error);
        throw error;
      });

      cypress.on('close', (code) => {
        resolve(code);
      });
    });

  return { run };
};
