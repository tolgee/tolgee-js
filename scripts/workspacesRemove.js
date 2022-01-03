const fs = require('fs');

const content = JSON.parse(fs.readFileSync('package.json'));

fs.renameSync('package.json', 'package.json.original');

delete content.workspaces;

fs.writeFileSync('package.json', JSON.stringify(content, null, 2));
