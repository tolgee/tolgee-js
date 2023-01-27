import fs from 'fs';
import { join } from 'path';
import { readdirSync } from 'fs';
import { expect } from '@jest/globals';

import { CHROME_EXTENSION_LINK } from '../packages/web/src/constants';

function getFiles(dir: string): string[] {
  const dirents = readdirSync(dir, { withFileTypes: true });
  const files = dirents.map((dirent) => {
    const res = join(dir, dirent.name);
    return dirent.isDirectory() ? getFiles(res) : res;
  });
  return Array.prototype.concat(...files);
}

const checkBuildFile = (filePath: string) => {
  const file = fs.readFileSync(filePath).toString();
  it(`DevTools not in ${filePath}`, () => {
    expect(file.includes(CHROME_EXTENSION_LINK)).toBeFalsy();
  });
};

const buildFolders = [
  './testapps/react/build',
  './testapps/vue/dist',
  './testapps/svelte/build',
  './testapps/ngx/dist',
  './testapps/react-i18next/build',
  './testapps/vue-i18next/dist',
  './testapps/gatsby/public',
  './testapps/next/.next',
  // next-internal uses InContextTools so it is there
  // './testapps/next-internal/.next'
];

describe('testapps ommit dev tools', () => {
  buildFolders.forEach((folder) => {
    describe(`checking ${folder}`, () => {
      const jsFiles = getFiles(folder).filter((f) => f.endsWith('js'));
      jsFiles.forEach((filePath) => {
        checkBuildFile(filePath);
      });
    });
  });
});
