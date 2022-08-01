const path = require('path');
const fs = require('fs');

const searchRecursively = function (dirPath, search, arrayOfFiles, depth) {
  if (typeof depth === 'number' && depth <= 0) {
    return arrayOfFiles;
  }

  const newDepth = typeof depth === 'number' ? depth - 1 : undefined;

  const files = fs.readdirSync(dirPath);

  arrayOfFiles = arrayOfFiles || [];

  files.forEach(function (file) {
    const basename = path.basename(file);

    const filePath = path.join(dirPath, file);

    if (basename === search) {
      arrayOfFiles.push(path.join(process.cwd(), dirPath, file));
    } else if (
      !fs.lstatSync(filePath).isSymbolicLink() &&
      fs.statSync(filePath).isDirectory()
    ) {
      arrayOfFiles = searchRecursively(
        path.join(dirPath, file),
        search,
        arrayOfFiles,
        newDepth
      );
    }
  });

  return arrayOfFiles;
};

const deleteFile = (file, recursive = false) => {
  console.log('deleting', file);
  fs.rmSync(file, { recursive, force: recursive });
};

const files = searchRecursively('.', 'node_modules', [], 5);
files.forEach((file) => {
  deleteFile(file, true);
});

const packageLocks = searchRecursively('.', 'package-lock.json', [], 5);
packageLocks.forEach((file) => {
  deleteFile(file);
});

deleteFile('.pnpm-store', true);
