const fs = require('fs');
const path = require('path');
const { exit } = require('process');

const MAX_SIZE = 5000;
const CACHE_FOLDER = 'node_modules/.cache/turbo';

const getAllFiles = function (dirPath, arrayOfFiles) {
  const files = fs.readdirSync(dirPath);

  arrayOfFiles = arrayOfFiles || [];

  files.forEach(function (file) {
    if (fs.statSync(dirPath + '/' + file).isDirectory()) {
      arrayOfFiles = getAllFiles(dirPath + '/' + file, arrayOfFiles);
    } else {
      arrayOfFiles.push(path.join(process.cwd(), dirPath, file));
    }
  });

  return arrayOfFiles;
};

const getTotalSize = function (directoryPath) {
  const arrayOfFiles = getAllFiles(directoryPath);

  let totalSize = 0;

  arrayOfFiles.forEach(function (filePath) {
    totalSize += fs.statSync(filePath).size;
  });

  return totalSize;
};

const convertBytes = function (bytes) {
  if (bytes == 0) {
    return 'n/a';
  }

  return (bytes / Math.pow(1024, 2)).toFixed(1);
};

if (!fs.existsSync(CACHE_FOLDER)) {
  console.log('CACHE EMPTY');
  exit();
}

const size = getTotalSize(CACHE_FOLDER);

const mbSize = convertBytes(size);

console.log(mbSize, 'MB');

if (mbSize > MAX_SIZE) {
  console.log('TOO BIG, REMOVING');
  fs.rmSync(CACHE_FOLDER, { recursive: true, force: true });
} else {
  console.log('OK');
}
