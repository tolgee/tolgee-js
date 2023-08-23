const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'package.json');

fs.readFile(filePath, 'utf8', (err, data) => {
  if (err) {
    console.error('Error reading file:', err);
    return;
  }

  try {
    const packageJson = JSON.parse(data);
    if (packageJson.workspaces) {
      delete packageJson.workspaces;
      const modifiedContent = JSON.stringify(packageJson, null, 2);

      fs.writeFile(filePath, modifiedContent, 'utf8', (writeErr) => {
        if (writeErr) {
          console.error('Error writing file:', writeErr);
        } else {
          console.log('"workspaces" field removed from package.json');
        }
      });
    } else {
      console.log('"workspaces" field does not exist in package.json');
    }
  } catch (parseErr) {
    console.error('Error parsing JSON:', parseErr);
  }
});
