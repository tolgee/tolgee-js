const { pathsToModuleNameMapper } = require('ts-jest');
const { compilerOptions } = require('../../tsconfig.json');

module.exports = {
  preset: 'ts-jest',
  resolver: 'jest-preset-angular/build/resolvers/ng-jest-resolver.js',
  transformIgnorePatterns: ['node_modules/.*/node_modules/(?!@angular)'],
  transform: {
    '^.+\\.(ts|js|mjs|html|svg)$': 'jest-preset-angular',
  },
  testEnvironment: 'jsdom',
  unmockedModulePathPatterns: ['/node_modules/*', '/ngx-tolgee/src/__mocks'],
  modulePathIgnorePatterns: ['cypress'],
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, {
    prefix: '<rootDir>/../../',
  }),
  globals: {
    'ts-jest': {
      tsconfig: '<rootDir>/tsconfig.spec.json',
    },
  },
  setupFilesAfterEnv: ['<rootDir>/src/test-setup.ts'],
};
