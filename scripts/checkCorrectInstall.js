const fs = require('fs');

const content = JSON.parse(fs.readFileSync('package.json'));

const WARN_MESSAGE = `
Seems like you are installing dependencies through 'npm install', which is forbidden.

    Use 'npm run init' or 'npm run install:root'

`;

if (content.workspaces) {
  console.log(WARN_MESSAGE);
  process.exit(1);
}
