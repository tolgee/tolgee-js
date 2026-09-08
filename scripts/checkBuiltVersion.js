/*
 * Fails the build when an artifact does not carry its own version.
 *
 * @tolgee/web asks the CDN for the in-context bundle of the version it was told at build time, so an artifact
 * carrying anything else downloads a different release of itself. That is what tolgee/tolgee-js#3537 was: the
 * version came from an environment variable the build tool did not forward, so every published artifact asked for
 * the `prerelease` dist-tag, which had been left four majors behind.
 */
const { readFileSync, existsSync } = require('fs');
const { join } = require('path');

const CHECKS = [
  {
    package: 'web',
    files: [
      'dist/tolgee-web.production.esm.js',
      'dist/tolgee-web.development.esm.js',
    ],
  },
  { package: 'core', files: ['dist/tolgee.esm.js'] },
];

const SDK_VERSION_HEADER = /x-tolgee-sdk-version['"]?\s*:\s*["']([^"']*)["']/;
const IN_CONTEXT_VERSION = /loadInContextLib\(\s*["']([^"']*)["']/;

const problems = [];

for (const { package: name, files } of CHECKS) {
  const root = join(__dirname, '..', 'packages', name);
  const { version } = require(join(root, 'package.json'));

  for (const file of files) {
    const path = join(root, file);
    if (!existsSync(path)) {
      problems.push(`${name}/${file} is missing, build the packages first`);
      continue;
    }
    const built = readFileSync(path, 'utf8');

    const reported = built.match(SDK_VERSION_HEADER)?.[1];
    if (reported !== version) {
      problems.push(
        `${name}/${file} reports itself as ${reported ?? '(no version header)'}, expected ${version}`
      );
    }

    const inContext = built.match(IN_CONTEXT_VERSION)?.[1];
    if (inContext !== undefined && inContext !== version) {
      problems.push(
        `${name}/${file} fetches the in-context bundle of ${inContext}, expected ${version}`
      );
    }
  }
}

if (problems.length) {
  console.error('Built artifacts do not carry their own version:');
  problems.forEach((problem) => console.error(`  - ${problem}`));
  process.exit(1);
}

console.log('Built artifacts carry their own version.');
