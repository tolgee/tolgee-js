const fs = require('fs');
const path = require('path');

// pnpm doesn't handle "publicConfig.directory" correctly
// so when library uses separate package.json in build folder we need to redirect
// symlink directly there

{
  const target = './packages/ngx/dist/ngx-tolgee';
  const locationDir = './testapps/ngx/node_modules/@tolgee';
  const location = path.join(locationDir, 'ngx');

  if (fs.existsSync(location)) {
    fs.rmSync(location, { recursive: true, force: true });
    fs.symlinkSync(path.relative(locationDir, target), location);
  }
}
