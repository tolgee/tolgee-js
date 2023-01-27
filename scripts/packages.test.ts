import fs from 'fs';
import path from 'path';
import { expect } from '@jest/globals';

import { searchRecursively } from './searchRecursively';

const assertExpr = (expr, message) => {
  it(message, () => {
    expect(Boolean(expr)).toBe(true);
  });
};

const fileExists = (dir, filePath) => {
  const absolutePath = path.join(dir, filePath);
  return fs.existsSync(absolutePath);
};

const assertFileExists = (dir, filePath, message) => {
  if (filePath) {
    const absolutePath = path.join(dir, filePath);
    assertExpr(fs.existsSync(absolutePath), ` - ${message}: ${filePath}`);
  }
};

const checkedPackages = [];

const checkExports = (folder, exports: any, keyPath = ['exports']) => {
  Object.entries(exports || {}).forEach(([key, target]) => {
    if (typeof target === 'string') {
      assertFileExists(
        folder,
        target,
        path.join(keyPath.join('.'), key).replace('/', '.')
      );
    } else if (typeof target === 'object') {
      checkExports(folder, exports[key] || {}, [...keyPath, key]);
    }
  });
};

const checkPackage = (filePath) => {
  const folder = path.dirname(filePath);
  const f = JSON.parse(fs.readFileSync(filePath).toString());

  if (f.private == true) {
    return;
  }

  const isInternal = f.internal === true;

  if (f.publishConfig?.directory) {
    describe(`${f.name} -> ${f.publishConfig.directory}`, () => {
      assertFileExists(folder, f.publishConfig.directory, 'exists');
      if (fileExists(folder, f.publishConfig.directory)) {
        const pckg = path.join(
          folder,
          f.publishConfig.directory,
          'package.json'
        );
        if (!checkedPackages.includes(pckg)) {
          checkedPackages.push(pckg);
          checkPackage(pckg);
        }
      }
    });
    return;
  }

  describe(f.name || `${folder}/package.json`, () => {
    if (!isInternal) {
      assertExpr(f.name?.startsWith('@tolgee/'), 'Has correct name');
      assertExpr(f.publishConfig?.access, 'Is public');
      assertExpr(f.main || f.module || f.exports, 'Has entry point');
    }
    assertFileExists(folder, f.main, 'main');
    assertFileExists(folder, f.module, 'module');
    if (f.module) {
      // if module field ends with .mjs it causes issues with webpack
      assertExpr(f.module.endsWith('.js'), ' - module ends with .js');
    }
    assertFileExists(folder, f.types, 'types');
    checkExports(folder, f.exports || {});

    assertFileExists(
      folder,
      f.publishConfig?.directory,
      'publishConfig.directory'
    );
  });
};

describe('check package.json files', () => {
  const files = searchRecursively('./packages', 'package.json', [], 4);
  files.forEach((filePath) => {
    checkPackage(filePath);
  });
});
