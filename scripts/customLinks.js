const { existsSync, rmSync, symlinkSync } = require('fs');
const { join, resolve, relative } = require('path');
const { execSync } = require('child_process');

// pnpm doesn't handle "publicConfig.directory" correctly,
// so when a library uses separate package.json in the build folder,
// we need to redirect symlink directly there

const target = './packages/ngx/dist/ngx-tolgee';
const locationDir = './testapps/ngx/node_modules/@tolgee';
const location = join(locationDir, 'ngx');

if (existsSync(location)) {
  rmSync(location, { recursive: true, force: true });
}

// Use junction on Windows (doesn't require admin), symlink on Unix
const absoluteTarget = resolve(target);
const absoluteLocation = resolve(location);

if (process.platform === 'win32') {
  // Use mklink /J for junction on Windows
  execSync(`mklink /J "${absoluteLocation}" "${absoluteTarget}"`);
} else {
  symlinkSync(relative(locationDir, target), location);
}
