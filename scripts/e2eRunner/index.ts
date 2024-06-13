import { Command, program } from 'commander';
import { config } from './config';
import { log, setDebug } from './log';
import { CommandRunner } from './CommandRunner';
import path from 'path';
import { CypressRunner } from './CypressRunner';
import { ServicesRunner } from './serviceRunner/ServicesRunner';
import fs from 'fs';

const programWithOptions = program
  .option('--debug', 'enable debug output', false)
  .option('--verbose', 'enable verbose output', false);

let servicesRunner: ReturnType<typeof ServicesRunner> | undefined;

createOpenCommand();
createRunCommand();

function createBaseRunCommand(commandName) {
  const command = programWithOptions.command(commandName);
  command.option(
    '--stdout <services>',
    'coma separated services with enabled stdout',
    ''
  );
  return command;
}

function addIntegrationCommands(command: Command, commandName) {
  Object.entries(config.tests).forEach(([integration, integrationConfig]) => {
    command.option('--skip-build', 'skip build:e2e step', false);
    command.command(integration).action(async () => {
      let code = 0;
      try {
        await downloadExtension();
        const opts = command.opts();
        if (!opts.skipBuild) {
          await buildE2e();
        }
        await runServices(integrationConfig, opts.stdout);
        code = await runCypress(commandName, integration, opts.headed);
      } catch (e) {
        log('error', e);
        await servicesRunner?.exit();
        process.exit(1);
      } finally {
        await servicesRunner?.exit();
        process.exit(code);
      }
    });
  });
}

function createOpenCommand() {
  const command = createBaseRunCommand('open');
  addIntegrationCommands(command, 'open');
}

function createRunCommand() {
  const command = createBaseRunCommand('run');
  command.option('--headed', 'should cypress run in headed mode?', false);
  addIntegrationCommands(command, 'run');
}

process.on('uncaughtException', async (e) => {
  // eslint-disable-next-line no-console
  console.error(e);
  // eslint-disable-next-line no-console
  console.log(e.stack);
  await servicesRunner?.exit();
  process.exit(1);
});

process.stdin.resume();
process.on('SIGINT', async () => {
  await servicesRunner?.exit();
});

const parsed = program.parse();
setDebug(parsed.opts().debug);

async function buildE2e() {
  log('info', '🟡 Building packages...');
  const buildE2e = CommandRunner({
    command: 'pnpm run build:e2e',
    cwd: path.resolve(__dirname, '../../'),
  });

  await buildE2e.run().then(() => {
    log('info', '🟢 Packages built...');
  });
}

async function runCypress(command, integration, headed: boolean) {
  const cypressRunner = CypressRunner({
    runType: command,
    spec: integration,
    headed,
  });
  return await cypressRunner.run();
}

async function runServices(integrationConfig, stdoutServices: string) {
  log('info', '🟡 Running services...');

  servicesRunner = ServicesRunner({
    commandLineServices: integrationConfig.commandLineServices,
    dockerComposeServices: {
      ...config.dockerComposeServices,
      ...integrationConfig.dockerComposeServices,
    },
    stdoutServices: stdoutServices,
  });

  await servicesRunner.run();
}

async function downloadExtension() {
  const extensionPath = path.resolve(__dirname, '../../e2e/extension');
  if (!fs.existsSync(path.resolve(extensionPath, 'manifest.json'))) {
    fs.mkdirSync(path.resolve(extensionPath), { recursive: true });
    log('info', 'Extension not downloaded... Downloading...');
    await CommandRunner({
      command:
        'npx download-github-release --prerelease --search Tolgee-chrome tolgee chrome-plugin',
      cwd: extensionPath,
    }).run();
    log('info', 'Extension downloaded.');
  }
}
