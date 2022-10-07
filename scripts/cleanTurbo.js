const { searchRecursively } = require('./searchRecursively');
const fs = require('fs');

const CACHE_FOLDER = 'node_modules/.cache/turbo';

console.log('deleting', CACHE_FOLDER);
fs.rmSync(CACHE_FOLDER, { recursive: true, force: true });

const files = searchRecursively('.', '.turbo', [], 5);

files.forEach((file) => {
  console.log('deleting', file);
  fs.rmSync(file, { recursive: true, force: true });
});
