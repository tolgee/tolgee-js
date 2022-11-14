export type DockerComposeServiceConfig = {
  waitForOutput: string | RegExp;
  timeout?: number;
  stdErrEnabled?: boolean;
};

export type CommandLineServiceConfig = {
  command: string;
  cwd: string;
  waitForOutput?: string | RegExp;
  timeout?: number;
  environment?: Record<string, string>;
  stdErrEnabled?: boolean;
};

export type TestDefinition = {
  dockerComposeServices?: Record<string, DockerComposeServiceConfig>;
  commandLineServices?: Record<string, CommandLineServiceConfig>;
};

export type Config = {
  dockerComposeServices: Record<string, DockerComposeServiceConfig>;
  tests: Record<string, TestDefinition>;
};
