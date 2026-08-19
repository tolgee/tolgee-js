const { existsSync, lstatSync, rmSync, symlinkSync, unlinkSync } = require('fs');
const { join, resolve, relative } = require('path');
const { execSync } = require('child_process');

// pnpm doesn't handle "publicConfig.directory" correctly,
// so when a library uses separate package.json in the build folder,
// we need to redirect symlink directly there

// Resolve paths from the repo root (this script's parent dir), not the caller's CWD, so it works whether it's run from
// the repo root (packages/ngx build) or from the ngx testapp's own build.
const repoRoot = resolve(__dirname, '..');
const target = join(repoRoot, 'packages/ngx/dist/ngx-tolgee');
const locationDir = join(repoRoot, 'testapps/ngx/node_modules/@tolgee');
const location = join(locationDir, 'ngx');

// Use junction on Windows (doesn't require admin), symlink on Unix
const absoluteTarget = target;
const absoluteLocation = location;

// Only touch `location` when the local build output exists. In the E2E flow the testapp installs @tolgee/ngx from the
// registry via npm and there is no local dist to link — removing it there would delete the installed package and break
// the build, so leave whatever is already installed untouched.
if (!existsSync(absoluteTarget)) {
  // Drop a leftover link from a previous build: a symlink/junction now points at the missing dist (present to lstat but
  // unresolvable), so it would shadow resolution. A real installed directory (the E2E npm flow) resolves and is kept.
  let danglingLink = false;
  try {
    lstatSync(absoluteLocation);
    danglingLink = !existsSync(absoluteLocation);
  } catch {
    // Nothing at that path — nothing to clean.
  }
  if (danglingLink) {
    // Use unlink, not rmSync: rmSync follows the link, sees the missing target, and (with force) treats it as already
    // gone, leaving the dangling link in place. Fall back to rmSync for a Windows junction unlink can't remove.
    try {
      unlinkSync(absoluteLocation);
    } catch {
      rmSync(absoluteLocation, { recursive: true, force: true });
    }
  }
  console.warn(
    `Warning: Target directory "${absoluteTarget}" does not exist. Skipping symlink creation; leaving any installed @tolgee/ngx in place. Run build first.`
  );
} else {
  // Replace an existing symlink/junction (or a stale install) with a fresh link to the built library.
  rmSync(location, { recursive: true, force: true });
  if (process.platform === 'win32') {
    // Use mklink /J for junction on Windows
    execSync(`mklink /J "${absoluteLocation}" "${absoluteTarget}"`);
  } else {
    symlinkSync(relative(locationDir, target), location);
  }
}
